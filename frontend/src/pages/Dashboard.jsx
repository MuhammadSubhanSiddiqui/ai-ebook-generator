import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Book, Plus, Clock, MoreVertical, Search, X } from 'lucide-react';
import Navbar from '../components/Navbar';
import { fetchEbooks, createEbook, deleteEbook } from '../api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [ebooks, setEbooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newBookTitle, setNewBookTitle] = useState('');
  const [newBookPrompt, setNewBookPrompt] = useState('');
  const [creating, setCreating] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');

  const fetchEbooks = async () => {
    try {
      const data = await fetchEbooks();
      setEbooks(data);
    } catch (error) {
      console.error('Error fetching ebooks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEbooks();
  }, []);

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
    if (!newBookTitle || !newBookPrompt) return;

    setCreating(true);
    try {
      const ebook = await createEbook({
        title: newBookTitle,
        description: newBookPrompt,
        coverColor: 'bg-gradient-to-br from-blue-500 to-indigo-600'
      });
      setShowModal(false);
      setNewBookTitle('');
      setNewBookPrompt('');
      fetchEbooks(); // Refresh list
    } catch (error) {
      console.error('Error creating ebook:', error);
    } finally {
      setCreating(false);
    }
  };

  const filteredEbooks = ebooks.filter(ebook => {
    const matchesSearch = ebook.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ebook.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All Status" ||
                          ebook.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="container mx-auto px-4 py-12 md:px-6">
        {/* Header Section */}
        <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Library</h1>
            <p className="mt-1 text-gray-500">Manage your collection of AI-generated ebooks</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center justify-center gap-2 rounded-full bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg hover:bg-indigo-700 hover:shadow-xl transition-all transform hover:-translate-y-0.5"
          >
            <Plus className="h-5 w-5" />
            Create New eBook
          </button>
        </div>

        {/* Search and Filter */}
        <div className="mb-10 flex flex-col sm:flex-row items-center gap-4 rounded-2xl bg-white p-2 shadow-sm border border-gray-100">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search your library..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border-none bg-transparent py-3 pl-12 pr-4 text-gray-900 placeholder-gray-400 focus:ring-0"
            />
          </div>
          <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto rounded-xl border-none bg-transparent px-4 py-3 text-sm font-medium text-gray-600 focus:ring-0 cursor-pointer hover:text-indigo-600"
          >
            <option>All Status</option>
            <option>Completed</option>
            <option>Draft</option>
            <option>Generating</option>
          </select>
        </div>

        {/* Content Grid */}
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
          </div>
        ) : filteredEbooks.length > 0 ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredEbooks.map((ebook) => (
              <div key={ebook._id} className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-gray-100">
                {/* Cover Placeholder */}
                <div className={`h-48 w-full ${ebook.coverColor || 'bg-gradient-to-br from-indigo-500 to-purple-600'} flex items-center justify-center relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
                  <Book className="h-16 w-16 text-white/80 drop-shadow-md transform group-hover:scale-110 transition-transform duration-300" />
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col p-6">
                  <div className="mb-3 flex items-start justify-between relative">
                    <h3 className="font-bold text-lg text-gray-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">{ebook.title}</h3>
                    <button
                      onClick={() => setActiveDropdown(activeDropdown === ebook._id ? null : ebook._id)}
                      className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-50"
                    >
                      <MoreVertical className="h-5 w-5" />
                    </button>

                    {/* Dropdown Menu */}
                    {activeDropdown === ebook._id && (
                      <div className="absolute right-0 top-8 z-10 w-32 rounded-lg border border-gray-100 bg-white shadow-lg">
                        <button
                          onClick={() => handleDeleteEbook(ebook._id)}
                          className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 first:rounded-t-lg last:rounded-b-lg"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                  <p className="mb-6 text-sm text-gray-500 line-clamp-2 flex-1 leading-relaxed">
                    {ebook.description}
                  </p>

                  <div className="mt-auto flex items-center justify-between border-t border-gray-50 pt-4">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-gray-400">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{new Date(ebook.createdAt).toLocaleDateString()}</span>
                    </div>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize tracking-wide
                      ${ebook.status === 'completed' ? 'bg-green-50 text-green-600 border border-green-100' :
                        ebook.status === 'generating' ? 'bg-yellow-50 text-yellow-600 border border-yellow-100' :
                        'bg-gray-50 text-gray-600 border border-gray-100'}`}>
                      {ebook.status}
                    </span>
                  </div>

                  {/* Action Button */}
                  {ebook.status === 'completed' && (
                    <Link
                      to={`/ebook/${ebook._id}`}
                      className="mt-5 flex w-full items-center justify-center rounded-xl bg-indigo-50 px-4 py-2.5 text-sm font-bold text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all duration-300"
                    >
                      Read Book
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-200 bg-white/50 py-24 text-center">
            <div className="mb-6 rounded-full bg-indigo-50 p-6">
              <Book className="h-10 w-10 text-indigo-400" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-gray-900">No eBooks yet</h3>
            <p className="mb-8 text-gray-500 max-w-md">Your library is empty. Start your journey by creating your first AI-generated eBook today.</p>
            <button
              onClick={() => setShowModal(true)}
              className="rounded-full bg-indigo-600 px-8 py-3 text-sm font-bold text-white shadow-lg hover:bg-indigo-700 hover:shadow-xl transition-all"
            >
              Create First eBook
            </button>
          </div>
        )}
      </main>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Create New eBook</h2>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEbook} className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">eBook Title</label>
                <input
                  type="text"
                  value={newBookTitle}
                  onChange={(e) => setNewBookTitle(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                  placeholder="e.g., The Future of AI"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">What should this book be about?</label>
                <textarea
                  value={newBookPrompt}
                  onChange={(e) => setNewBookPrompt(e.target.value)}
                  className="h-32 w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none resize-none"
                  placeholder="Describe the topic, target audience, and key points you want to cover..."
                  required
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-xl px-6 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="rounded-xl bg-indigo-600 px-8 py-3 text-sm font-bold text-white shadow-lg hover:bg-indigo-700 disabled:opacity-50"
                >
                  {creating ? 'Creating...' : 'Generate eBook'}
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