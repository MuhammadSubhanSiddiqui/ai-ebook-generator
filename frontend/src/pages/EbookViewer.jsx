import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Download,
  Settings,
  ChevronLeft,
  ChevronRight,
  X,
  Save,
  GripVertical,
  AlertTriangle,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  BookOpen,
  Layers,
  FileText
} from 'lucide-react';
import { jsPDF } from "jspdf";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { fetchEbook as apiFetchEbook, updateEbook } from '../api';
import { EbookViewerSkeleton } from '../components/Skeletons';

export const cleanChapterTitle = (title) => {
  if (!title) return '';
  return title
    .replace(/^(Chapter|Ch\.?)\s*\d+[\s:.-]*/i, '')
    .replace(/^\d+[\s:.-]+\s*/, '')
    .trim() || title;
};

const SortableItem = ({ id, chapter, index }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200/80 mb-2 dark:bg-gray-800 dark:border-gray-700"
    >
      <div {...attributes} {...listeners} className="cursor-grab text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
        <GripVertical className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 mr-2 dark:text-indigo-400">
          Chapter {index + 1}
        </span>
        <p className="text-xs font-semibold text-gray-900 truncate dark:text-white">
          {cleanChapterTitle(chapter.title)}
        </p>
      </div>
    </div>
  );
};

const EbookViewer = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ebook, setEbook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editChapterTitle, setEditChapterTitle] = useState("");
  const [editChapterText, setEditChapterText] = useState("");
  const [chapters, setChapters] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [isTakingLonger, setIsTakingLonger] = useState(false);
  const [generationElapsed, setGenerationElapsed] = useState(0);

  const pollTimeoutRef = useRef(null);
  const pollAttemptRef = useRef(0);
  const maxPollAttempts = 20;

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const fetchEbookData = useCallback(async () => {
    const data = await apiFetchEbook(id);
    if (!data) throw new Error('No data returned from server');
    setEbook(data);
    setChapters(data.content || []);
    return data;
  }, [id]);

  const pollEbook = useCallback(async (isManual = false) => {
    if (isManual) {
      setRefreshing(true);
    }

    try {
      const data = await fetchEbookData();
      setError(null);

      // Stop polling if completed or failed
      if (data.status === 'completed' || data.status === 'failed') {
        if (pollTimeoutRef.current) {
          clearTimeout(pollTimeoutRef.current);
          pollTimeoutRef.current = null;
        }
        setIsTakingLonger(false);
        setLoading(false);
        setRefreshing(false);
        return;
      }

      // If still generating and not exceeded max attempts
      pollAttemptRef.current += 1;
      if (pollAttemptRef.current >= maxPollAttempts) {
        setIsTakingLonger(true);
        if (pollTimeoutRef.current) {
          clearTimeout(pollTimeoutRef.current);
          pollTimeoutRef.current = null;
        }
      } else {
        const nextDelay = Math.min(3000 * Math.pow(1.15, pollAttemptRef.current), 8000);
        if (document.visibilityState !== 'hidden') {
          pollTimeoutRef.current = setTimeout(() => {
            pollEbook(false);
          }, nextDelay);
        }
      }
    } catch (err) {
      console.error('Error fetching ebook:', err);
      setError(err.message || 'Failed to load ebook');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [fetchEbookData]);

  // Lifecycle polling & timer
  useEffect(() => {
    pollAttemptRef.current = 0;
    setIsTakingLonger(false);
    setGenerationElapsed(0);
    pollEbook(false);

    const timer = setInterval(() => {
      setGenerationElapsed((prev) => prev + 1);
    }, 1000);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        if (ebook?.status === 'generating' && !pollTimeoutRef.current && !isTakingLonger) {
          pollEbook(false);
        }
      } else {
        if (pollTimeoutRef.current) {
          clearTimeout(pollTimeoutRef.current);
          pollTimeoutRef.current = null;
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(timer);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (pollTimeoutRef.current) {
        clearTimeout(pollTimeoutRef.current);
      }
    };
  }, [id, pollEbook]);

  const getCoverRGB = (coverClass) => {
    if (!coverClass) return [79, 70, 229];
    if (coverClass.includes('purple')) return [147, 51, 234];
    if (coverClass.includes('blue')) return [37, 99, 235];
    if (coverClass.includes('emerald')) return [5, 150, 105];
    if (coverClass.includes('rose') || coverClass.includes('red')) return [225, 29, 72];
    if (coverClass.includes('amber')) return [217, 119, 6];
    return [79, 70, 229];
  };

  const handleDownloadPDF = () => {
    if (!ebook || !ebook.content || ebook.content.length === 0) return;

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;
    const [r, g, b] = getCoverRGB(ebook.coverColor);

    // Cover Page
    doc.setFillColor(r, g, b);
    doc.rect(0, 0, pageWidth, 115, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(26);
    const titleLines = doc.splitTextToSize(ebook.title, contentWidth);
    doc.text(titleLines, margin, 50);

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(230, 230, 255);
    doc.text("AI GENERATED EBOOK", margin, 35);

    doc.setTextColor(55, 65, 81);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'italic');
    const descLines = doc.splitTextToSize(ebook.description || '', contentWidth);
    doc.text(descLines, margin, 135);

    doc.setDrawColor(229, 231, 235);
    doc.line(margin, pageHeight - 45, pageWidth - margin, pageHeight - 45);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(107, 114, 128);
    doc.text(`Author: ${ebook.author || 'AI eBook Creator'}`, margin, pageHeight - 35);
    doc.text(`Chapters: ${ebook.content.length}`, margin, pageHeight - 28);
    doc.text(`Date: ${new Date(ebook.createdAt || Date.now()).toLocaleDateString()}`, margin, pageHeight - 21);
    doc.text("Generated with Google Gemini AI", pageWidth - margin, pageHeight - 21, { align: 'right' });

    // Table of Contents Page
    doc.addPage();
    doc.setTextColor(17, 24, 39);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.text("Table of Contents", margin, 35);

    doc.setDrawColor(r, g, b);
    doc.setLineWidth(0.8);
    doc.line(margin, 40, margin + 40, 40);

    let tocY = 55;
    doc.setFontSize(12);
    doc.setTextColor(55, 65, 81);

    ebook.content.forEach((chapter, index) => {
      doc.setFont('helvetica', 'bold');
      const cleanTitle = cleanChapterTitle(chapter.title);
      const chapterLabel = `Chapter ${index + 1}: ${cleanTitle}`;
      doc.text(chapterLabel, margin, tocY);

      doc.setFont('helvetica', 'normal');
      const targetPageNum = index + 3;
      doc.text(`${targetPageNum}`, pageWidth - margin, tocY, { align: 'right' });

      doc.setDrawColor(209, 213, 219);
      doc.setLineDashPattern([1, 2], 0);
      const textWidth = doc.getTextWidth(chapterLabel);
      doc.line(margin + textWidth + 3, tocY - 1, pageWidth - margin - 10, tocY - 1);
      doc.setLineDashPattern([], 0);

      tocY += 12;
      if (tocY > pageHeight - 30) {
        doc.addPage();
        tocY = 30;
      }
    });

    // Chapter Pages
    let pdfPageNum = 3;

    ebook.content.forEach((chapter, index) => {
      doc.addPage();
      const cleanTitle = cleanChapterTitle(chapter.title);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(156, 163, 175);
      doc.text(ebook.title, margin, 15);
      doc.text(`Chapter ${index + 1}`, pageWidth - margin, 15, { align: 'right' });
      doc.setDrawColor(243, 244, 246);
      doc.line(margin, 18, pageWidth - margin, 18);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.setTextColor(17, 24, 39);
      doc.text(cleanTitle, margin, 32);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      doc.setTextColor(55, 65, 81);

      const splitText = doc.splitTextToSize(chapter.text || '', contentWidth);
      let contentY = 44;
      const lineHeight = 6.5;

      for (let i = 0; i < splitText.length; i++) {
        if (contentY + lineHeight > pageHeight - 25) {
          doc.setFontSize(9);
          doc.setTextColor(156, 163, 175);
          doc.text(`Page ${pdfPageNum}`, pageWidth / 2, pageHeight - 12, { align: 'center' });

          doc.addPage();
          pdfPageNum++;
          contentY = 25;

          doc.setFontSize(9);
          doc.setTextColor(156, 163, 175);
          doc.text(`${cleanTitle} (Continued)`, margin, 15);
          doc.line(margin, 18, pageWidth - margin, 18);

          doc.setFontSize(11);
          doc.setTextColor(55, 65, 81);
        }
        doc.text(splitText[i], margin, contentY);
        contentY += lineHeight;
      }

      doc.setFontSize(9);
      doc.setTextColor(156, 163, 175);
      doc.text(`Page ${pdfPageNum}`, pageWidth / 2, pageHeight - 12, { align: 'center' });
      pdfPageNum++;
    });

    const safeFilename = ebook.title.replace(/[^a-zA-Z0-9_-]/g, '_');
    doc.save(`${safeFilename || 'ebook'}.pdf`);
  };

  const openSettings = () => {
    setChapters(ebook.content || []);
    setEditTitle(ebook.title);
    const currentContent = ebook.content[currentPage - 1];
    if (currentContent) {
      setEditChapterTitle(currentContent.title);
      setEditChapterText(currentContent.text);
    }
    setShowSettings(true);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setChapters((items) => {
        const oldIndex = items.findIndex((item) => item._id === active.id || item.title === active.id);
        const newIndex = items.findIndex((item) => item._id === over.id || item.title === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleUpdateEbook = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const originalChapter = ebook.content[currentPage - 1];
      let updatedContent = [...chapters];

      if (originalChapter) {
        const targetIndex = updatedContent.findIndex(
          (c) => c._id === originalChapter._id || c.title === originalChapter.title
        );
        if (targetIndex !== -1) {
          updatedContent[targetIndex] = {
            ...updatedContent[targetIndex],
            title: editChapterTitle,
            text: editChapterText,
          };
        }
      }

      const updatedEbook = await updateEbook(id, {
        title: editTitle,
        content: updatedContent,
      });

      setEbook(updatedEbook);
      setChapters(updatedEbook.content);
      setShowSettings(false);
    } catch (err) {
      console.error('Update error:', err);
      setError(err.payload?.message || err.message || 'Failed to update ebook');
    }
  };

  if (loading) {
    return <EbookViewerSkeleton />;
  }

  if (error && !ebook) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-slate-50 p-6 text-center dark:bg-[#090d16]">
        <div className="mb-4 rounded-2xl bg-rose-100 p-4 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400">
          <AlertTriangle className="h-10 w-10" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-gray-900 dark:text-white">Failed to Load eBook</h2>
        <p className="mt-2 max-w-md text-sm text-gray-600 dark:text-gray-400">{error}</p>
        <Link
          to="/dashboard"
          className="mt-6 rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-indigo-700 transition-all"
        >
          Return to Dashboard
        </Link>
      </div>
    );
  }

  if (!ebook) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-slate-50 p-6 text-center dark:bg-[#090d16]">
        <h2 className="font-serif text-2xl font-bold text-gray-900 dark:text-white">eBook Not Found</h2>
        <Link
          to="/dashboard"
          className="mt-4 rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-indigo-700 transition-all"
        >
          Return to Dashboard
        </Link>
      </div>
    );
  }

  // FAILED STATE UI
  if (ebook.status === 'failed') {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-slate-50 p-6 text-center dark:bg-[#090d16] animate-page-in">
        <div className="mb-4 rounded-3xl bg-rose-100 p-5 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400 shadow-md">
          <AlertTriangle className="h-12 w-12" />
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          eBook Generation Failed
        </h2>
        <p className="mt-3 max-w-md text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          {ebook.generationError || 'Google Gemini encountered an issue creating your chapters. Please try again.'}
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => pollEbook(true)}
            className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-indigo-700 transition-all"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Check Status Again</span>
          </button>
          <Link
            to="/dashboard"
            className="rounded-xl border border-gray-300 bg-white px-6 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-all dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // GENERATING STATE UI (Multi-Step Timeline Progress Experience)
  if (ebook.status === 'generating') {
    const steps = [
      { id: 1, title: 'Analyzing Topic & Outline', icon: Sparkles, threshold: 0 },
      { id: 2, title: 'Drafting Chapters with Gemini AI', icon: FileText, threshold: 12 },
      { id: 3, title: 'Structuring Layout & Pagination', icon: Layers, threshold: 28 },
      { id: 4, title: 'Finalizing eBook & Reader', icon: BookOpen, threshold: 42 },
    ];

    const currentStepIndex = steps.findIndex((s, idx) => {
      const nextStep = steps[idx + 1];
      if (!nextStep) return true;
      return generationElapsed >= s.threshold && generationElapsed < nextStep.threshold;
    });

    const activeStep = currentStepIndex !== -1 ? currentStepIndex : 0;
    const progressPercent = Math.min(10 + Math.floor(generationElapsed * 1.8), 92);

    return (
      <div className="min-h-screen w-full overflow-y-auto bg-slate-50 py-10 px-4 sm:px-6 flex flex-col items-center justify-center dark:bg-[#090d16] animate-page-in">
        <div className="w-full max-w-lg rounded-3xl border border-gray-200/80 bg-white p-8 shadow-xl dark:border-gray-800 dark:bg-gray-900 text-center relative overflow-hidden my-auto">
          {/* Ambient header glow */}
          <div className="absolute -top-24 -left-24 h-48 w-48 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-24 -right-24 h-48 w-48 rounded-full bg-purple-500/10 blur-3xl pointer-events-none"></div>

          <div className="mb-6 relative inline-flex items-center justify-center">
            <div className="h-16 w-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center dark:bg-indigo-950/80 dark:text-indigo-400 shadow-md">
              <Sparkles className="h-8 w-8 animate-pulse text-indigo-500" />
            </div>
          </div>

          <h2 className="font-serif text-2xl font-bold text-gray-900 dark:text-white">
            Crafting "{ebook.title}"
          </h2>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Elapsed Time: {generationElapsed}s • Gemini 3.6 Flash
          </p>

          {/* Progress Bar */}
          <div className="mt-6 mb-8 w-full bg-gray-100 rounded-full h-2 overflow-hidden dark:bg-gray-800">
            <div
              className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-full rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>

          {/* Step Timeline */}
          <div className="space-y-3.5 text-left mb-8">
            {steps.map((step, idx) => {
              const isCompleted = idx < activeStep;
              const isCurrent = idx === activeStep;
              const StepIcon = step.icon;

              return (
                <div
                  key={step.id}
                  className={`flex items-center gap-3 p-2.5 rounded-xl transition-all duration-300 ${
                    isCurrent
                      ? 'bg-indigo-50/80 border border-indigo-200/70 dark:bg-indigo-950/40 dark:border-indigo-900/50'
                      : isCompleted
                      ? 'text-gray-500 dark:text-gray-400 opacity-80'
                      : 'text-gray-400 dark:text-gray-600 opacity-40'
                  }`}
                >
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-lg ${
                      isCompleted
                        ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/80 dark:text-emerald-400'
                        : isCurrent
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-gray-100 text-gray-400 dark:bg-gray-800'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : <StepIcon className="h-3.5 w-3.5" />}
                  </div>

                  <span className={`text-xs font-semibold ${isCurrent ? 'text-indigo-950 dark:text-indigo-200' : ''}`}>
                    {step.title}
                  </span>

                  {isCurrent && (
                    <div className="ml-auto flex items-center gap-1 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 animate-pulse">
                      In Progress
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-between border-t border-gray-100 pt-5 dark:border-gray-800">
            <Link
              to="/dashboard"
              className="text-xs font-semibold text-gray-500 hover:text-gray-800 transition-colors dark:text-gray-400 dark:hover:text-white"
            >
              ← Background Processing
            </Link>

            <button
              onClick={() => {
                pollAttemptRef.current = 0;
                pollEbook(true);
              }}
              disabled={refreshing}
              className="flex items-center gap-1.5 rounded-xl bg-gray-100 px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-200 transition-all dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              <span>{refreshing ? 'Checking...' : 'Check Status'}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentContent = ebook.content && ebook.content.length > 0 ? ebook.content[currentPage - 1] : null;

  if (!currentContent) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-slate-50 p-6 text-center dark:bg-[#090d16]">
        <h2 className="font-serif text-2xl font-bold text-gray-900 dark:text-white">No Chapter Content</h2>
        <p className="mt-2 text-sm text-gray-500">This eBook contains no pages yet.</p>
        <Link to="/dashboard" className="mt-4 text-xs font-bold text-indigo-600 hover:underline">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-slate-100 transition-colors duration-200 dark:bg-[#090d16]">
      {/* Reader Top Bar */}
      <header className="flex h-16 items-center justify-between border-b border-gray-200/80 bg-white/90 px-4 shadow-sm backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/90 z-20">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            to="/dashboard"
            className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="min-w-0">
            <h1 className="truncate font-serif text-base font-bold text-gray-900 dark:text-white sm:text-lg">
              {ebook.title}
            </h1>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">
              Chapter {currentPage} of {ebook.totalPages}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-1.5 rounded-xl bg-indigo-50 px-3.5 py-2 text-xs font-bold text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all shadow-sm dark:bg-indigo-950/60 dark:text-indigo-300 dark:hover:bg-indigo-600 dark:hover:text-white"
            title="Download PDF"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export PDF</span>
          </button>

          <button
            onClick={openSettings}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
            title="Settings"
          >
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Main Book Reader Area with Page Turn Animation */}
      <main className="flex-1 overflow-y-auto py-8 px-4 sm:px-6 md:px-8 flex justify-center items-start">
        <div
          key={currentPage}
          className="w-full max-w-3xl rounded-2xl border border-gray-200/80 bg-white p-6 sm:p-10 md:p-14 shadow-md transition-colors duration-200 dark:border-gray-800 dark:bg-gray-900 mb-8 flex flex-col animate-page-in"
        >
          <div className="mb-8 border-b border-gray-100 pb-5 dark:border-gray-800">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              Chapter {currentPage}
            </span>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mt-1">
              {cleanChapterTitle(currentContent.title)}
            </h2>
          </div>

          <div className="font-serif text-base md:text-lg text-gray-700 dark:text-gray-300 leading-loose whitespace-pre-wrap flex-1 selection:bg-indigo-100 dark:selection:bg-indigo-900">
            {currentContent.text}
          </div>
        </div>
      </main>

      {/* Reader Bottom Navigation Bar */}
      <footer className="border-t border-gray-200/80 bg-white/90 px-4 py-3 shadow-sm backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/90 z-20">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-transparent transition-all dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Previous</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
              {currentPage} <span className="text-gray-400 font-normal">/ {ebook.totalPages}</span>
            </span>
          </div>

          <button
            onClick={() => setCurrentPage((p) => Math.min(ebook.totalPages, p + 1))}
            disabled={currentPage === ebook.totalPages}
            className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-transparent transition-all dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <span>Next</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </footer>

      {/* Edit Chapters Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-page-in">
          <div className="w-full max-w-2xl rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-800 dark:bg-gray-900 max-h-[90vh] overflow-y-auto">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="font-serif text-2xl font-bold text-gray-900 dark:text-white">Edit eBook Content</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Reorder chapters or modify the current chapter text
                </p>
              </div>
              <button
                onClick={() => setShowSettings(false)}
                className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateEbook} className="space-y-6">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                  Book Title
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm text-gray-900 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 outline-none transition-all dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:ring-indigo-900/50"
                  required
                />
              </div>

              {/* Drag and Drop Chapters */}
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                  Drag to Reorder Chapters
                </label>
                <div className="max-h-48 overflow-y-auto rounded-xl border border-gray-200 p-2 dark:border-gray-800 dark:bg-gray-800/40">
                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={chapters.map((c) => c._id || c.title)} strategy={verticalListSortingStrategy}>
                      {chapters.map((chapter, index) => (
                        <SortableItem
                          key={chapter._id || chapter.title}
                          id={chapter._id || chapter.title}
                          chapter={chapter}
                          index={index}
                        />
                      ))}
                    </SortableContext>
                  </DndContext>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-5 dark:border-gray-800">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">
                  Edit Current Page (Chapter {currentPage})
                </h3>

                <div className="mb-4">
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                    Chapter Title
                  </label>
                  <input
                    type="text"
                    value={editChapterTitle}
                    onChange={(e) => setEditChapterTitle(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm text-gray-900 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 outline-none transition-all dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:ring-indigo-900/50"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                    Chapter Content
                  </label>
                  <textarea
                    value={editChapterText}
                    onChange={(e) => setEditChapterText(e.target.value)}
                    className="h-44 w-full rounded-xl border border-gray-200 bg-gray-50/50 p-4 text-sm text-gray-900 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 outline-none transition-all resize-none dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:ring-indigo-900/50 font-serif leading-relaxed"
                  />
                </div>
              </div>

              {error && <p className="text-xs font-medium text-rose-600 dark:text-rose-400">{error}</p>}

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setShowSettings(false)}
                  className="rounded-xl px-5 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={refreshing}
                  className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-indigo-700 disabled:opacity-50 transition-all"
                >
                  <Save className="h-4 w-4" />
                  {refreshing ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EbookViewer;