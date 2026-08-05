import React, { useState, useEffect } from 'react';
import { Trash2, Plus, Send } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { fetchTestimonials, createTestimonial, deleteTestimonial } from '../api';

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [newTestimonial, setNewTestimonial] = useState('');
  const [userRole, setUserRole] = useState('Writer');
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
        role: userRole
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
      setTestimonials(testimonials.filter(t => t._id !== id));
    } catch (err) {
      console.error('Error deleting testimonial:', err);
    }
  };

  return (
    <section id="testimonials" className="bg-white py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-between gap-4 mb-16 sm:flex-row">
          <h2 className="text-3xl font-bold text-gray-900 text-center sm:text-left">
            Trusted by writers everywhere
          </h2>

          {userInfo && (
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 rounded-full bg-indigo-600 px-6 py-2.5 text-sm font-bold text-white shadow-md hover:bg-indigo-700 transition-all"
            >
              {showForm ? 'Cancel' : (
                <>
                  <Plus className="h-4 w-4" />
                  Add Testimonial
                </>
              )}
            </button>
          )}
        </div>

        {showForm && (
          <div className="mb-12 mx-auto max-w-2xl rounded-2xl bg-gray-50 p-6 border border-gray-200 shadow-sm animate-in fade-in slide-in-from-top-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Share your experience</h3>
            <form onSubmit={handleAddTestimonial}>
              <textarea
                value={newTestimonial}
                onChange={(e) => setNewTestimonial(e.target.value)}
                placeholder="What do you think about AI Ebook Creator?"
                className="w-full rounded-xl border border-gray-200 p-4 mb-4 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none min-h-[100px]"
                required
              />
              <div className="flex gap-4 items-center">
                <input
                  type="text"
                  value={userRole}
                  onChange={(e) => setUserRole(e.target.value)}
                  placeholder="Your Role (e.g. Author)"
                  className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-indigo-700 transition-all disabled:opacity-50"
                >
                  {submitting ? 'Posting...' : (
                    <>
                      <Send className="h-4 w-4" />
                      Post
                    </>
                  )}
                </button>
              </div>
            </form>
            {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent mx-auto"></div>
          </div>
        ) : testimonials.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((item) => (
              <div key={item._id} className="group relative flex flex-col rounded-2xl border border-gray-100 bg-gray-50 p-8 transition-all hover:shadow-md">
                {userInfo && userInfo._id === item.user && (
                  <button
                    onClick={() => handleDeleteTestimonial(item._id)}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Delete Testimonial"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
                <p className="mb-6 flex-1 text-lg italic text-gray-700">"{item.text}"</p>
                <div>
                  <h4 className="font-bold text-gray-900">{item.authorName}</h4>
                  <span className="text-sm text-gray-500">{item.role}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="col-span-3 text-center py-12 text-gray-500 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            No testimonials yet. Be the first to share your story!
          </div>
        )}
      </div>
    </section>
  );
};

export default Testimonials;