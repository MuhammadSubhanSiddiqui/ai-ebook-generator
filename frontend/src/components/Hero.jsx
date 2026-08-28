import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, BookOpen, Layers, CheckCircle2, Star, Clock, FileCheck2, Bookmark } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Hero = () => {
  const { user } = useAuth();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50/60 via-slate-50 to-white pt-10 pb-20 md:pt-16 md:pb-32 dark:from-[#0c101d] dark:via-[#090d16] dark:to-[#090d16] transition-colors duration-200">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-indigo-400/10 blur-[120px] rounded-full pointer-events-none dark:bg-indigo-600/10"></div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Copy & CTAs */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100/80 bg-white/90 px-4 py-1.5 text-xs font-semibold text-indigo-700 shadow-sm backdrop-blur-md dark:border-indigo-900/60 dark:bg-indigo-950/60 dark:text-indigo-300">
              <Sparkles className="h-3.5 w-3.5 text-amber-500 animate-pulse" />
              <span>Next-Generation Intelligent Publishing</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white leading-[1.15]">
              Publish Thought-Leading <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400">
                eBooks in Minutes
              </span>
            </h1>

            <p className="mx-auto lg:mx-0 max-w-xl text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed font-sans">
              Transform your outlines, knowledge, or thoughts into structured multi-chapter eBooks. Generate rich prose, design custom book covers, and export ready-to-publish PDFs instantly.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                to={user ? "/dashboard" : "/signup"}
                className="group flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-indigo-600 px-7 py-3.5 text-sm font-bold text-white shadow-xl shadow-indigo-500/25 hover:bg-indigo-700 hover:shadow-2xl transition-all transform hover:-translate-y-0.5 active:scale-95 cursor-pointer"
              >
                <span>{user ? "Go to Dashboard" : "Start Creating for Free"}</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <a
                href="#features"
                className="flex w-full sm:w-auto items-center justify-center rounded-xl border border-gray-200 bg-white/80 px-6 py-3.5 text-sm font-bold text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all dark:border-gray-800 dark:bg-gray-900/80 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
              >
                Explore Features
              </a>
            </div>

            {/* Trust Badges */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs font-semibold text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>No Credit Card Required</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>Instant PDF Export</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="flex text-amber-400">
                  <Star className="h-3.5 w-3.5 fill-current" />
                  <Star className="h-3.5 w-3.5 fill-current" />
                  <Star className="h-3.5 w-3.5 fill-current" />
                  <Star className="h-3.5 w-3.5 fill-current" />
                  <Star className="h-3.5 w-3.5 fill-current" />
                </div>
                <span>5.0 Rating</span>
              </div>
            </div>
          </div>

          {/* Right Column: Realistic 3D Hardcover Book & Live Manuscript Showcase */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md animate-float-slow">
              
              {/* Floating Performance Pill */}
              <div className="absolute -top-4 -left-4 z-30 flex items-center gap-2 rounded-2xl border border-gray-200/80 bg-white/95 px-3.5 py-2 shadow-lg backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/95">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-800 dark:text-gray-200">
                  <Clock className="h-3.5 w-3.5 text-indigo-500" />
                  <span>Generated in 14.8s</span>
                </div>
              </div>

              {/* Ambient Glow Aura */}
              <div className="absolute -inset-2 rounded-3xl bg-gradient-to-tr from-indigo-500/30 via-purple-500/25 to-pink-500/20 opacity-60 blur-2xl dark:opacity-40"></div>

              {/* 3D Book Container */}
              <div className="relative rounded-3xl border border-gray-200/90 bg-white/95 p-6 shadow-2xl backdrop-blur-xl dark:border-gray-800 dark:bg-gray-900/95">
                
                {/* 3D Realistic Hardcover Presentation */}
                <div className="book-3d-wrap my-2">
                  <div className="book-3d-cover relative rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-indigo-900 book-spine-crease p-6 text-white overflow-visible cursor-pointer">
                    
                    {/* Realistic layered paper edges */}
                    <div className="book-pages-edge"></div>

                    {/* Bookmark Ribbon */}
                    <div className="absolute -top-2 right-8 h-10 w-4 bg-gradient-to-b from-amber-400 to-amber-600 shadow-md rounded-b-sm transform skew-x-2"></div>

                    {/* Outer embossed frame */}
                    <div className="border border-amber-400/40 rounded-xl p-5 relative">
                      {/* Inner gold frame corner details */}
                      <div className="absolute top-1 left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-amber-300"></div>
                      <div className="absolute top-1 right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-amber-300"></div>
                      <div className="absolute bottom-1 left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-amber-300"></div>
                      <div className="absolute bottom-1 right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-amber-300"></div>

                      <div className="flex items-center justify-between mb-4">
                        <span className="text-[9px] font-extrabold uppercase tracking-widest gold-foil-text">
                          ✦ MASTER AUTHOR EDITION
                        </span>
                        <span className="text-[9px] font-semibold text-amber-200/70 tracking-wider">
                          VOL. 1
                        </span>
                      </div>

                      <h3 className="font-display text-xl font-bold leading-snug my-5 text-white tracking-wide">
                        The Architecture of Modern Artificial Intelligence
                      </h3>

                      <div className="flex items-center justify-between border-t border-amber-400/30 pt-3 mt-4">
                        <p className="text-[10px] font-bold text-amber-200 tracking-wider uppercase">
                          By AI eBook Creator
                        </p>
                        <span className="text-[9px] font-mono text-white/60">
                          2026 RELEASE
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Open Manuscript Prose Snippet Preview */}
                <div className="mt-5 p-4 rounded-2xl bg-slate-50 border border-slate-100 dark:bg-gray-800/60 dark:border-gray-800/80">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-200/60 dark:border-gray-700/60">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                      Chapter 1 Excerpt
                    </span>
                    <span className="text-[10px] font-semibold text-gray-500 dark:text-gray-400">
                      Page 1 of 5
                    </span>
                  </div>

                  <p className="font-serif text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                    <span className="float-left font-serif text-2xl font-bold text-indigo-600 dark:text-indigo-400 leading-none mr-1.5 mt-0.5">T</span>
                    o understand modern autonomous systems, one must examine the delicate orchestration between prompt context, generative models, and multi-agent workflows...
                  </p>
                </div>

                {/* Floating Bottom Publishing Indicator */}
                <div className="mt-3.5 flex items-center justify-between text-xs px-2 text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-1.5 font-medium">
                    <FileCheck2 className="h-4 w-4 text-emerald-500" />
                    <span>5 Chapters • 12,400 Words</span>
                  </div>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-0.5 rounded-full text-[10px]">
                    PDF Ready
                  </span>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;