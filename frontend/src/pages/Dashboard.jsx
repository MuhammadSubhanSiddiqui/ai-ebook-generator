import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Book, Plus, Clock, MoreVertical, Search, X, Sparkles, BookOpen, Trash2, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import { EbookCardSkeleton } from '../components/Skeletons';
import { fetchEbooks as apiFetchEbooks, createEbook, deleteEbook } from '../api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [ebooks, setEbooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newBookTitle, setNewBookTitle] = useState('');
  const [newBookPrompt, setNewBookPrompt] = useState('');
  const [selectedCover, setSelectedCover] = useState('bg-gradient-to-br from-blue-600 via-indigo-700 to-indigo-900');
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');

  const coverOptions = [
    { label: 'Sapphire Indigo', value: 'bg-gradient-to-br from-blue-600 via-indigo-700 to-indigo-900', color: 'bg-indigo-600' },
    { label: 'Royal Amethyst', value: 'bg-gradient-to-br from-purple-600 via-violet-800 to-slate-900', color: 'bg-purple-600' },
    { label: 'Emerald Forest', value: 'bg-gradient-to-br from-emerald-600 via-teal-800 to-slate-900', color: 'bg-emerald-600' },
    { label: 'Crimson Rose', value: 'bg-gradient-to-br from-rose-600 via-red-800 to-neutral-900', color: 'bg-rose-600' },
    { label: 'Amber Sun', value: 'bg-gradient-to-br from-amber-500 via-orange-700 to-stone-900', color: 'bg-amber-500' },
  ];

  const loadEbooks = async () => {
    try {
      const data = await apiFetchEbooks();
      setEbooks(data);
    } catch (error) {
      console.error('Error fetching ebooks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEbooks();
  }, []);

  useEffect(() => {
    const hasGenerating = ebooks.some((ebook) => ebook.status === 'generating');
    if (hasGenerating) {
      const interval = setInterval(() => {
        loadEbooks();
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [ebooks]);

  const handleDeleteEbook = async (id) => {
    if (!window.confirm("Are you sure you want to delete this ebook?")) return;

    try {
      await deleteEbook(id);
      setEbooks(ebooks.filter((ebook) => ebook._id !== id));
      setActiveDropdown(null);
    } catch (error) {
      console.error('Error deleting ebook:', error);
    }
  };

  const handleCreateEbook = async (e) => {
    e.preventDefault();
    if (!newBookTitle.trim() || !newBookPrompt.trim()) return;

    setCreating(true);
    setCreateError('');
    try {
      const ebook = await createEbook({
        title: newBookTitle.trim(),
        description: newBookPrompt.trim(),
        coverColor: selectedCover,
      });
      setShowModal(false);
      setNewBookTitle('');
      setNewBookPrompt('');
      if (ebook && ebook._id) {
        navigate(`/ebook/${ebook._id}`);
      } else {
        loadEbooks();
      }
    } catch (error) {
      console.error('Error creating ebook:', error);
      setCreateError(error.payload?.message || error.message || 'Failed to create eBook. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  const filteredEbooks = ebooks.filter((ebook) => {
    const matchesSearch =
      ebook.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ebook.description && ebook.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus =
      statusFilter === "All Status" ||
      ebook.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-slate-50 transition-colors duration-200 dark:bg-[#090d16]">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-serif text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              My Library
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Manage, edit, and export your collection of AI-generated eBooks
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 hover:shadow-xl transition-all transform hover:-translate-y-0.5 active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span>Create New eBook</span>
          </button>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-8 flex flex-col gap-3 rounded-2xl border border-gray-200/80 bg-white p-2.5 shadow-sm transition-colors sm:flex-row sm:items-center dark:border-gray-800 dark:bg-gray-900/70">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title or topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border-none bg-transparent py-2 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-0 dark:text-white dark:placeholder-gray-500"
            />
          </div>
          <div className="h-px w-full bg-gray-200 sm:h-8 sm:w-px dark:bg-gray-800"></div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full rounded-xl border-none bg-transparent px-3 py-2 text-sm font-medium text-gray-600 focus:outline-none focus:ring-0 cursor-pointer sm:w-auto hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 dark:bg-gray-900"
          >
            <option value="All Status">All Statuses</option>
            <option value="Completed">Completed</option>
            <option value="Generating">Generating</option>
            <option value="Draft">Draft</option>
            <option value="Failed">Failed</option>
          </select>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <EbookCardSkeleton />
            <EbookCardSkeleton />
            <EbookCardSkeleton />
            <EbookCardSkeleton />
          </div>
        ) : filteredEbooks.length > 0 ? (
          <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredEbooks.map((ebook, idx) => (
              <div
                key={ebook._id}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 dark:border-gray-800 dark:bg-gray-900 animate-page-in"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                {/* Realistic Book Cover Layout */}
                <div
                  className={`h-52 w-full ${
                    ebook.coverColor || 'bg-gradient-to-br from-blue-600 via-indigo-700 to-indigo-900'
                  } book-spine-crease relative flex flex-col justify-between p-4 text-white overflow-hidden shadow-inner`}
                >
                  {/* Subtle decorative cover frame */}
                  <div className="absolute inset-2 border border-white/20 rounded-lg pointer-events-none"></div>

                  <div className="relative z-10 flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/80 bg-black/20 px-2 py-0.5 rounded">
                      AI Edition
                    </span>
                    <BookOpen className="h-4 w-4 text-white/70" />
                  </div>

                  <div className="relative z-10 my-auto text-center px-2">
                    <h3 className="font-serif text-lg font-bold leading-snug drop-shadow-md text-white line-clamp-2">
                      {ebook.title}
                    </h3>
                  </div>

                  <div className="relative z-10 text-center">
                    <p className="text-[11px] font-medium text-white/75 tracking-wider uppercase">
                      {ebook.author || 'AI Author'}
                    </p>
                  </div>
                </div>

                {/* Card Content & Metadata */}
                <div className="flex flex-1 flex-col p-5">
                  <div className="mb-2 flex items-start justify-between relative">
                    <h4 className="font-bold text-base text-gray-900 line-clamp-1 group-hover:text-indigo-600 transition-colors dark:text-white dark:group-hover:text-indigo-400">
                      {ebook.title}
                    </h4>
                    <button
                      onClick={() => setActiveDropdown(activeDropdown === ebook._id ? null : ebook._id)}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      aria-label="Options"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>

                    {/* Dropdown Menu */}
                    {activeDropdown === ebook._id && (
                      <div className="absolute right-0 top-8 z-20 w-32 rounded-xl border border-gray-100 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                        <button
                          onClick={() => handleDeleteEbook(ebook._id)}
                          className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg dark:hover:bg-red-950/40 dark:text-red-400"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete eBook
                        </button>
                      </div>
                    )}
                  </div>

                  <p className="mb-5 text-xs text-gray-500 line-clamp-2 flex-1 leading-relaxed dark:text-gray-400">
                    {ebook.description || 'No description provided.'}
                  </p>

                  <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-3.5 dark:border-gray-800">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-gray-400 dark:text-gray-500">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{new Date(ebook.createdAt).toLocaleDateString()}</span>
                    </div>

                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize tracking-wide ${
                        ebook.status === 'completed'
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-200/60 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800'
                          : ebook.status === 'generating'
                          ? 'bg-amber-50 text-amber-600 border border-amber-200/60 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800 animate-pulse'
                          : ebook.status === 'failed'
                          ? 'bg-rose-50 text-rose-600 border border-rose-200/60 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800'
                          : 'bg-gray-50 text-gray-600 border border-gray-200 dark:bg-gray-800 dark:text-gray-400'
                      }`}
                    >
                      {ebook.status}
                    </span>
                  </div>

                  {/* Read / Action CTA */}
                  {ebook.status === 'completed' ? (
                    <Link
                      to={`/ebook/${ebook._id}`}
                      className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl bg-indigo-50 px-4 py-2.5 text-xs font-bold text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all duration-200 dark:bg-indigo-950/50 dark:text-indigo-300 dark:hover:bg-indigo-600 dark:hover:text-white"
                    >
                      <span>Read eBook</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  ) : ebook.status === 'failed' ? (
                    <Link
                      to={`/ebook/${ebook._id}`}
                      className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl bg-rose-50 px-4 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-600 hover:text-white transition-all duration-200 dark:bg-rose-950/50 dark:text-rose-300 dark:hover:bg-rose-600 dark:hover:text-white"
                    >
                      <span>View Error</span>
                    </Link>
                  ) : (
                    <Link
                      to={`/ebook/${ebook._id}`}
                      className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl bg-amber-50 px-4 py-2.5 text-xs font-bold text-amber-700 hover:bg-amber-600 hover:text-white transition-all duration-200 dark:bg-amber-950/50 dark:text-amber-300 dark:hover:bg-amber-600 dark:hover:text-white"
                    >
                      <span>View Progress</span>
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : searchQuery ? (
          /* Search Empty State */
          <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-200 bg-white/60 py-16 px-4 text-center dark:border-gray-800 dark:bg-gray-900/40">
            <div className="mb-4 rounded-2xl bg-gray-100 p-4 dark:bg-gray-800">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">No eBooks matched your search</h3>
            <p className="mt-1 text-sm text-gray-500 max-w-sm dark:text-gray-400">
              We couldn't find anything matching "<span className="font-semibold text-gray-700 dark:text-gray-300">{searchQuery}</span>". Try another keyword or clear your filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('All Status');
              }}
              className="mt-5 rounded-xl bg-gray-100 px-5 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-200 transition-all dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          /* Zero-eBooks Empty State */
          <div className="relative overflow-hidden flex flex-col items-center justify-center rounded-3xl border border-gray-200/80 bg-gradient-to-b from-white to-indigo-50/30 py-20 px-6 text-center shadow-sm dark:border-gray-800 dark:from-gray-900 dark:to-gray-900/40">
            <div className="mb-6 relative">
              <div className="absolute inset-0 rounded-full bg-indigo-500/20 blur-2xl animate-pulse"></div>
              <div className="relative rounded-3xl bg-indigo-50 p-6 text-indigo-600 dark:bg-indigo-950/80 dark:text-indigo-400 shadow-md">
                <Book className="h-12 w-12" />
              </div>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Your Library is Waiting for its First eBook
            </h2>
            <p className="mt-3 text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-lg leading-relaxed">
              Transform any idea, topic, or outline into a complete, publishable multi-chapter eBook powered by Google Gemini AI in seconds.
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="mt-8 flex items-center gap-2 rounded-xl bg-indigo-600 px-8 py-3.5 text-sm font-bold text-white shadow-xl shadow-indigo-500/25 hover:bg-indigo-700 hover:shadow-2xl transition-all transform hover:-translate-y-0.5 active:scale-95"
            >
              <Sparkles className="h-4 w-4 text-amber-300" />
              <span>Create Your First eBook</span>
            </button>
          </div>
        )}
      </main>

      {/* Create Modal Dialog */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-page-in">
          <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-2xl dark:border-gray-800 dark:bg-gray-900">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="font-serif text-2xl font-bold text-gray-900 dark:text-white">Create New eBook</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Specify your topic and choose a book cover theme</p>
              </div>
              <button
                onClick={() => {
                  setShowModal(false);
                  setCreateError('');
                }}
                className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {createError && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200/80 rounded-xl text-xs font-semibold text-rose-600 dark:bg-rose-950/40 dark:border-rose-900/50 dark:text-rose-400">
                {createError}
              </div>
            )}

            <form onSubmit={handleCreateEbook} className="space-y-5">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                  eBook Title
                </label>
                <input
                  type="text"
                  value={newBookTitle}
                  onChange={(e) => setNewBookTitle(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm text-gray-900 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 outline-none transition-all dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:ring-indigo-900/50"
                  placeholder="e.g. The Architecture of Modern Artificial Intelligence"
                  required
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                  What should this book cover?
                </label>
                <textarea
                  value={newBookPrompt}
                  onChange={(e) => setNewBookPrompt(e.target.value)}
                  className="h-28 w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm text-gray-900 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 outline-none transition-all resize-none dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:ring-indigo-900/50"
                  placeholder="Describe the target audience, tone, key themes, and depth you want..."
                  required
                />
              </div>

              {/* Cover Theme Selection */}
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                  Cover Style
                </label>
                <div className="flex gap-2.5 items-center">
                  {coverOptions.map((opt) => (
                    <button
                      type="button"
                      key={opt.value}
                      onClick={() => setSelectedCover(opt.value)}
                      className={`h-8 w-8 rounded-full ${opt.color} transition-all transform ${
                        selectedCover === opt.value
                          ? 'ring-4 ring-indigo-500/40 scale-110 shadow-md'
                          : 'opacity-70 hover:opacity-100 hover:scale-105'
                      }`}
                      title={opt.label}
                    />
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-xl px-5 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-indigo-700 disabled:opacity-50 transition-all"
                >
                  {creating ? 'Generating...' : 'Generate eBook'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;