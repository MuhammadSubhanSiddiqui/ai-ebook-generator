import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Settings, ChevronLeft, ChevronRight, X, Save, GripVertical, AlertTriangle, RefreshCw } from 'lucide-react';
import { jsPDF } from "jspdf";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { fetchEbook as apiFetchEbook, updateEbook } from '../api';

const SortableItem = ({ id, chapter, index }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 mb-2">
      <div {...attributes} {...listeners} className="cursor-grab text-gray-400 hover:text-gray-600">
        <GripVertical className="h-5 w-5" />
      </div>
      <div className="flex-1">
        <span className="text-xs font-bold text-gray-500 mr-2">Page {index + 1}</span>
        <span className="text-sm font-medium text-gray-900">{chapter.title}</span>
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

  const pollTimeoutRef = useRef(null);
  const pollAttemptRef = useRef(0);
  const maxPollAttempts = 15;

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
        // Schedule next poll with exponential backoff if tab is visible
        const nextDelay = Math.min(3000 * Math.pow(1.2, pollAttemptRef.current), 10000);
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

  // Initial load and visibility-aware polling
  useEffect(() => {
    pollAttemptRef.current = 0;
    setIsTakingLonger(false);
    pollEbook(false);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Tab resumed - check status immediately if still generating
        if (ebook?.status === 'generating' && !pollTimeoutRef.current && !isTakingLonger) {
          pollEbook(false);
        }
      } else {
        // Tab hidden - pause active timeout
        if (pollTimeoutRef.current) {
          clearTimeout(pollTimeoutRef.current);
          pollTimeoutRef.current = null;
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (pollTimeoutRef.current) {
        clearTimeout(pollTimeoutRef.current);
      }
    };
  }, [id, pollEbook]);

  // Helper to extract RGB from coverColor string
  const getCoverRGB = (coverClass) => {
    if (!coverClass) return [79, 70, 229]; // indigo-600 default
    if (coverClass.includes('purple')) return [147, 51, 234];
    if (coverClass.includes('blue')) return [37, 99, 235];
    if (coverClass.includes('green')) return [16, 185, 129];
    if (coverClass.includes('red')) return [239, 68, 68];
    if (coverClass.includes('orange')) return [249, 115, 22];
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

    // ==========================================
    // 1. STYLED COVER PAGE
    // ==========================================
    doc.setFillColor(r, g, b);
    doc.rect(0, 0, pageWidth, 110, 'F');

    // Title on cover
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(26);
    const titleLines = doc.splitTextToSize(ebook.title, contentWidth);
    doc.text(titleLines, margin, 50);

    // Subtitle badge on cover
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(230, 230, 255);
    doc.text("AI GENERATED EBOOK", margin, 35);

    // Cover Description box below header
    doc.setTextColor(55, 65, 81);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'italic');
    const descLines = doc.splitTextToSize(ebook.description || 'No description provided.', contentWidth);
    doc.text(descLines, margin, 130);

    // Author & metadata bottom card
    doc.setDrawColor(229, 231, 235);
    doc.line(margin, pageHeight - 45, pageWidth - margin, pageHeight - 45);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(107, 114, 128);
    doc.text(`Author: ${ebook.author || 'AI eBook Creator'}`, margin, pageHeight - 35);
    doc.text(`Total Chapters: ${ebook.content.length}`, margin, pageHeight - 28);
    doc.text(`Date: ${new Date(ebook.createdAt || Date.now()).toLocaleDateString()}`, margin, pageHeight - 21);
    doc.text("Generated with Google Gemini AI", pageWidth - margin, pageHeight - 21, { align: 'right' });

    // ==========================================
    // 2. TABLE OF CONTENTS PAGE
    // ==========================================
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
      const chapterLabel = `Chapter ${index + 1}: ${chapter.title}`;
      doc.text(chapterLabel, margin, tocY);

      doc.setFont('helvetica', 'normal');
      const targetPageNum = index + 3; // Cover = 1, TOC = 2, First chapter = 3
      doc.text(`${targetPageNum}`, pageWidth - margin, tocY, { align: 'right' });

      // Subtle dotted separator
      doc.setDrawColor(209, 213, 219);
      doc.setLineDashPattern([1, 2], 0);
      const textWidth = doc.getTextWidth(chapterLabel);
      doc.line(margin + textWidth + 3, tocY - 1, pageWidth - margin - 10, tocY - 1);
      doc.setLineDashPattern([], 0); // reset

      tocY += 12;
      if (tocY > pageHeight - 30) {
        doc.addPage();
        tocY = 30;
      }
    });

    // ==========================================
    // 3. CHAPTER PAGES
    // ==========================================
    let pdfPageNum = 3;

    ebook.content.forEach((chapter, index) => {
      doc.addPage();

      // Running top header
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(156, 163, 175);
      doc.text(ebook.title, margin, 15);
      doc.text(`Chapter ${index + 1}`, pageWidth - margin, 15, { align: 'right' });
      doc.setDrawColor(243, 244, 246);
      doc.line(margin, 18, pageWidth - margin, 18);

      // Chapter Title
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.setTextColor(17, 24, 39);
      doc.text(chapter.title, margin, 32);

      // Chapter Content Body
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      doc.setTextColor(55, 65, 81);

      const splitText = doc.splitTextToSize(chapter.text || '', contentWidth);
      let contentY = 44;
      const lineHeight = 6.5;

      for (let i = 0; i < splitText.length; i++) {
        if (contentY + lineHeight > pageHeight - 25) {
          // Bottom footer before new page
          doc.setFontSize(9);
          doc.setTextColor(156, 163, 175);
          doc.text(`Page ${pdfPageNum}`, pageWidth / 2, pageHeight - 12, { align: 'center' });

          doc.addPage();
          pdfPageNum++;
          contentY = 25;

          // Running header on continuation page
          doc.setFontSize(9);
          doc.setTextColor(156, 163, 175);
          doc.text(`${chapter.title} (Continued)`, margin, 15);
          doc.line(margin, 18, pageWidth - margin, 18);

          doc.setFontSize(11);
          doc.setTextColor(55, 65, 81);
        }
        doc.text(splitText[i], margin, contentY);
        contentY += lineHeight;
      }

      // Bottom footer for chapter end page
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
        const oldIndex = items.findIndex(item => item._id === active.id || item.title === active.id);
        const newIndex = items.findIndex(item => item._id === over.id || item.title === over.id);
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
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  if (error && !ebook) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-gray-50 p-4 text-center">
        <h2 className="text-xl font-bold text-gray-900">Error loading ebook</h2>
        <p className="text-gray-600 mt-2 max-w-md">{error}</p>
        <Link to="/dashboard" className="mt-4 text-indigo-600 hover:underline">Return to Dashboard</Link>
      </div>
    );
  }

  if (!ebook) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-gray-50 p-4 text-center">
        <h2 className="text-xl font-bold text-gray-900">eBook not found</h2>
        <Link to="/dashboard" className="mt-4 text-indigo-600 hover:underline">Return to Dashboard</Link>
      </div>
    );
  }

  // FAILED STATE UI
  if (ebook.status === 'failed') {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-gray-50 p-6 text-center">
        <div className="mb-4 rounded-full bg-red-100 p-4 text-red-600">
          <AlertTriangle className="h-10 w-10" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">eBook Generation Failed</h2>
        <p className="text-gray-600 mt-2 max-w-md text-sm sm:text-base">
          {ebook.generationError || 'The AI generation encountered an issue while generating content.'}
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => pollEbook(true)}
            className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-bold text-white shadow-md hover:bg-indigo-700 transition-all"
          >
            <RefreshCw className="h-4 w-4" />
            Retry Status
          </button>
          <Link
            to="/dashboard"
            className="rounded-xl border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // GENERATING STATE UI (with taking-longer state)
  if (ebook.status === 'generating') {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-gray-50 p-6 text-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent mb-4"></div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Generating your eBook...</h2>
        <p className="text-gray-600 mt-2 max-w-md">
          {isTakingLonger
            ? "Generation is taking longer than expected. Gemini AI is continuing to process in the background."
            : "This may take a few moments as AI crafts your chapters and formatting."}
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => {
              pollAttemptRef.current = 0;
              setIsTakingLonger(false);
              pollEbook(true);
            }}
            disabled={refreshing}
            className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-bold text-white shadow-md hover:bg-indigo-700 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Checking...' : 'Check Status'}
          </button>
          <Link to="/dashboard" className="rounded-xl border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const currentContent = ebook.content && ebook.content.length > 0 ? ebook.content[currentPage - 1] : null;

  if (!currentContent) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-gray-50 p-4 text-center">
        <h2 className="text-xl font-bold text-gray-900">No content available</h2>
        <p className="text-gray-600 mt-2 max-w-md">
          This ebook currently has no chapter content.
        </p>
        <Link to="/dashboard" className="mt-4 text-indigo-600 hover:underline">Return to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-gray-100">
      {/* Top Bar */}
      <header className="flex h-14 sm:h-16 items-center justify-between border-b border-gray-200 bg-white px-3 sm:px-4 shadow-sm">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <Link to="/dashboard" className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 shrink-0">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="min-w-0">
            <h1 className="truncate text-base sm:text-lg font-semibold text-gray-900">{ebook.title}</h1>
            <p className="text-xs text-gray-500">Page {currentPage} of {ebook.totalPages}</p>
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-1.5 rounded-xl bg-indigo-50 px-3 py-1.5 text-xs sm:text-sm font-bold text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
            title="Download PDF"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export PDF</span>
          </button>
          <button
            onClick={openSettings}
            className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
            title="Settings"
          >
            <Settings className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="mx-auto max-w-3xl rounded-xl bg-white p-8 shadow-sm md:p-12 min-h-[80vh]">
          <div className="mb-8 border-b border-gray-100 pb-4">
            <h2 className="text-2xl font-bold text-gray-900">{currentContent.title}</h2>
          </div>

          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
            {currentContent.text}
          </div>
        </div>
      </main>

      {/* Bottom Navigation Bar */}
      <footer className="border-t border-gray-200 bg-white px-4 py-3">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </button>

          <span className="text-sm font-medium text-gray-600">
            {currentPage} / {ebook.totalPages}
          </span>

          <button
            onClick={() => setCurrentPage(p => Math.min(ebook.totalPages, p + 1))}
            disabled={currentPage === ebook.totalPages}
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </footer>

      {/* Edit Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-2 sm:p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-4 sm:p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Edit eBook Content</h2>
              <button
                onClick={() => setShowSettings(false)}
                className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateEbook} className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">eBook Title</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                />
              </div>

              {/* Chapter Reordering Section */}
              <div>
                <h3 className="mb-2 sm:mb-3 text-sm font-medium text-gray-700">Organize Chapters</h3>
                <div className="max-h-40 sm:max-h-48 overflow-y-auto rounded-xl border border-gray-200 p-1 sm:p-2">
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={chapters.map(c => c._id || c.title)}
                      strategy={verticalListSortingStrategy}
                    >
                      {chapters.map((chapter, index) => (
                        <SortableItem key={chapter._id || chapter.title} id={chapter._id || chapter.title} chapter={chapter} index={index} />
                      ))}
                    </SortableContext>
                  </DndContext>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 sm:pt-6">
                <h3 className="mb-3 sm:mb-4 text-base sm:text-lg font-semibold text-gray-900">Edit Current Page (Page {currentPage})</h3>

                <div className="mb-3 sm:mb-4">
                  <label className="mb-1 sm:mb-2 block text-sm font-medium text-gray-700">Chapter Title</label>
                  <input
                    type="text"
                    value={editChapterTitle}
                    onChange={(e) => setEditChapterTitle(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-3 sm:px-4 py-2 sm:py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1 sm:mb-2 block text-sm font-medium text-gray-700">Content</label>
                  <textarea
                    value={editChapterText}
                    onChange={(e) => setEditChapterText(e.target.value)}
                    className="h-40 sm:h-64 w-full rounded-xl border border-gray-200 px-3 sm:px-4 py-2 sm:py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none resize-none"
                  />
                </div>
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowSettings(false)}
                  className="rounded-xl px-6 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={refreshing}
                  className="flex items-center gap-2 rounded-xl bg-indigo-600 px-8 py-3 text-sm font-bold text-white shadow-lg hover:bg-indigo-700 disabled:opacity-50"
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