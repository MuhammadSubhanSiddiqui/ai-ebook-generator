import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50 via-white to-white pt-20 pb-32 md:pt-32 md:pb-48">
      <div className="container mx-auto px-4 text-center md:px-6">
        <div className="inline-flex items-center rounded-full border border-indigo-100 bg-white px-4 py-1.5 text-sm font-medium text-indigo-600 shadow-sm mb-8 animate-fade-in-up">
          <Sparkles className="mr-2 h-4 w-4 text-yellow-500" />
          <span>Powered by Google Gemini AI</span>
        </div>
        
        <h1 className="mx-auto max-w-5xl text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl md:text-7xl lg:text-8xl mb-8 leading-tight">
          Create Professional eBooks <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">in Minutes, Not Months</span>
        </h1>
        
        <p className="mx-auto mt-6 max-w-2xl text-xl text-gray-600 leading-relaxed mb-10">
          Transform your ideas into polished ebooks with our AI-powered platform. 
          Generate content, design covers, and export ready-to-publish formats instantly.
        </p>
        
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link to="/signup" className="group flex items-center justify-center rounded-full bg-indigo-600 px-8 py-4 text-lg font-bold text-white shadow-xl hover:bg-indigo-700 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
            Start Creating for Free
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <button className="flex items-center justify-center rounded-full border-2 border-gray-200 bg-white px-8 py-4 text-lg font-bold text-gray-700 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 transition-all duration-300">
            Watch How It Works
          </button>
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