import React, { useState, useEffect } from 'react';
import { Trash2, Plus, Send, Star, Quote } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { fetchTestimonials, createTestimonial, deleteTestimonial } from '../api';

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [newTestimonial, setNewTestimonial] = useState('');
  const [userRole, setUserRole] = useState('Author & Creator');
  const [userInfo, setUserInfo] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTestimonialsData();
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      setUserInfo(JSON.parse(storedUserInfo));
    }
  }, []);

  const fetchTestimonialsData = async () => {
    try {
      const data = await fetchTestimonials();
      setTestimonials(data);
    } catch (err) {
      console.error('Error fetching testimonials:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTestimonial = async (e) => {
    e.preventDefault();
    if (!newTestimonial.trim()) {
      setError('Please enter a testimonial');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const data = await createTestimonial({
        text: newTestimonial,
        role: userRole,
      });
      setTestimonials([data, ...testimonials]);
      setNewTestimonial('');
      setShowForm(false);
    } catch (err) {
      setError(err.message || 'Failed to submit testimonial');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTestimonial = async (id) => {
    if (!window.confirm("Are you sure you want to delete this testimonial?")) return;

    try {
      await deleteTestimonial(id);
      setTestimonials(testimonials.filter((t) => t._id !== id));
    } catch (err) {
      console.error('Error deleting testimonial:', err);
    }
  };

  return (
    <section id="testimonials" className="bg-white py-24 transition-colors duration-200 dark:bg-[#090d16]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-4 mb-14 sm:flex-row">
          <div>
            <div className="inline-flex items-center rounded-full bg-indigo-50 px-3.5 py-1 text-xs font-semibold text-indigo-600 mb-2 dark:bg-indigo-950/80 dark:text-indigo-400">
              Community Voices
            </div>
            <h2 className="font-serif text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
              Trusted by Authors & Creators Everywhere
            </h2>
          </div>

          {userInfo && (
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-indigo-700 transition-all active:scale-95 shrink-0"
            >
              {showForm ? (
                <>
                  <span className="hidden sm:inline">Close Form</span>
                  <span className="sm:hidden">Close</span>
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">Add Your Review</span>
                  <span className="sm:hidden">Review</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Testimonial Submission Form */}
        {showForm && (
          <div className="mb-12 mx-auto max-w-2xl rounded-2xl bg-slate-50 p-6 border border-gray-200 shadow-sm dark:border-gray-800 dark:bg-gray-900 animate-page-in">
            <h3 className="font-serif text-xl font-bold text-gray-900 mb-3 dark:text-white">Share Your Story</h3>
            <form onSubmit={handleAddTestimonial}>
              <textarea
                value={newTestimonial}
                onChange={(e) => setNewTestimonial(e.target.value)}
                placeholder="What has been your experience generating eBooks with AI?"
                className="w-full rounded-xl border border-gray-200 bg-white p-4 mb-3 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none min-h-[110px] dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:ring-indigo-900/50"
                required
              />
              <div className="flex flex-col sm:flex-row gap-3 items-center">
                <input
                  type="text"
                  value={userRole}
                  onChange={(e) => setUserRole(e.target.value)}
                  placeholder="Your Role or Niche (e.g. Tech Author, Marketer)"
                  className="flex-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:ring-indigo-900/50"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-indigo-700 transition-all disabled:opacity-50 w-full sm:w-auto shadow-sm shrink-0"
                >
                  {submitting ? (
                    <span>Posting...</span>
                  ) : (
                    <>
                      <Send className="h-3.5 w-3.5" />
                      <span>Post Review</span>
                    </>
                  )}
                </button>
              </div>
            </form>
            {error && <p className="mt-3 text-xs font-medium text-rose-600 dark:text-rose-400">{error}</p>}
          </div>
        )}

        {/* Testimonials List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-3 border-indigo-600 border-t-transparent mx-auto"></div>
          </div>
        ) : testimonials.length > 0 ? (
          <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((item) => (
              <div
                key={item._id}
                className="group relative flex flex-col rounded-2xl border border-gray-200/80 bg-slate-50/70 p-7 sm:p-8 transition-all duration-300 hover:bg-white hover:shadow-xl hover:border-indigo-100 hover:-translate-y-1 dark:border-gray-800 dark:bg-gray-900/60 dark:hover:bg-gray-900 dark:hover:border-indigo-900/60"
              >
                {/* Delete Button (Owner) */}
                {userInfo && userInfo._id === item.user && (
                  <button
                    onClick={() => handleDeleteTestimonial(item._id)}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40"
                    title="Delete Review"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}

                {/* Rating Stars */}
                <div className="flex text-amber-400 mb-4">
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                </div>

                <p className="font-serif mb-6 flex-1 text-base italic text-gray-700 dark:text-gray-300 leading-relaxed">
                  "{item.text}"
                </p>

                <div className="flex items-center gap-3 border-t border-gray-200/60 pt-4 dark:border-gray-800">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-bold text-xs shadow-sm">
                    {(item.authorName || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm dark:text-white">{item.authorName}</h4>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{item.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-14 px-6 bg-slate-50 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800 dark:bg-gray-900/40">
            <p className="text-sm text-gray-500 dark:text-gray-400">No testimonials yet. Be the first to share your story!</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Testimonials;