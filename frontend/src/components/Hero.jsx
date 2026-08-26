import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50 via-white to-white pt-16 pb-24 md:pt-20 md:pb-40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 text-center">
        <div className="inline-flex items-center rounded-full border border-indigo-100 bg-white px-3 py-1.5 text-xs sm:text-sm font-medium text-indigo-600 shadow-sm mb-6 sm:mb-8">
          <Sparkles className="mr-2 h-4 w-4 text-yellow-500" />
          <span>Powered by Google Gemini AI</span>
        </div>

        <h1 className="mx-auto max-w-5xl text-3xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl lg:text-7xl mb-6 leading-tight">
          Create Professional eBooks <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">in Minutes, Not Months</span>
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed mb-8">
          Transform your ideas into polished ebooks with our AI-powered platform.
          Generate content, design covers, and export ready-to-publish formats instantly.
        </p>

        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <Link to="/signup" className="group flex w-full sm:w-auto items-center justify-center rounded-full bg-indigo-600 px-6 sm:px-8 py-3.5 sm:py-4 text-base sm:text-lg font-bold text-white shadow-xl hover:bg-indigo-700 hover:shadow-2xl transition-all">
            Start Creating for Free
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute top-0 -z-10 h-full w-full overflow-hidden">
        <div className="absolute -top-[30%] -right-[10%] h-[800px] w-[800px] rounded-full bg-purple-200/30 blur-[120px]"></div>
        <div className="absolute top-[20%] -left-[10%] h-[600px] w-[600px] rounded-full bg-indigo-200/30 blur-[100px]"></div>
      </div>
    </section>
  );
};

export default Hero;