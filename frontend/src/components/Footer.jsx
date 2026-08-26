import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Github, Linkedin, Globe } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-b from-gray-900 to-black py-12 text-white sm:py-16 overflow-hidden">
      {/* Background ambient decoration */}
      <div className="absolute top-0 left-1/4 h-64 w-96 -translate-y-1/2 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none"></div>
      <div className="absolute top-0 right-1/4 h-64 w-96 -translate-y-1/2 rounded-full bg-purple-500/10 blur-3xl pointer-events-none"></div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2 group cursor-pointer inline-flex">
              <BookOpen className="h-6 w-6 text-indigo-400 group-hover:rotate-12 transition-transform duration-300" />
              <span className="text-xl font-bold tracking-tight bg-clip-text bg-gradient-to-r from-white to-gray-300">
                AI eBook Creator
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Empowering writers with Artificial Intelligence. Turn ideas into publishable eBooks in minutes.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold tracking-wider uppercase text-gray-100">Product</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>
                <a
                  href="#features"
                  className="relative pb-0.5 hover:text-white transition-colors duration-200 after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-indigo-400 after:transition-all after:duration-300 hover:after:w-full inline-block"
                >
                  Features
                </a>
              </li>
              <li>
                <Link
                  to="/signup"
                  className="relative pb-0.5 hover:text-white transition-colors duration-200 after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-indigo-400 after:transition-all after:duration-300 hover:after:w-full inline-block"
                >
                  Get Started
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="relative pb-0.5 hover:text-white transition-colors duration-200 after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-indigo-400 after:transition-all after:duration-300 hover:after:w-full inline-block"
                >
                  Log In
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold tracking-wider uppercase text-gray-100">Company</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>
                <a
                  href="#features"
                  className="relative pb-0.5 hover:text-white transition-colors duration-200 after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-indigo-400 after:transition-all after:duration-300 hover:after:w-full inline-block"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#testimonials"
                  className="relative pb-0.5 hover:text-white transition-colors duration-200 after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-indigo-400 after:transition-all after:duration-300 hover:after:w-full inline-block"
                >
                  Testimonials
                </a>
              </li>
              <li>
                <Link
                  to="/login"
                  className="relative pb-0.5 hover:text-white transition-colors duration-200 after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-indigo-400 after:transition-all after:duration-300 hover:after:w-full inline-block"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold tracking-wider uppercase text-gray-100">Follow Us</h3>
            <div className="flex gap-3">
              <a
                href="https://github.com/MuhammadSubhanSiddiqui"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-800/80 text-gray-400 hover:bg-indigo-600 hover:text-white transition-all duration-300 hover:scale-110 hover:-translate-y-1 hover:shadow-[0_0_15px_rgba(99,102,241,0.5)] active:scale-95"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/muhammadsubhansiddiqui/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-800/80 text-gray-400 hover:bg-indigo-600 hover:text-white transition-all duration-300 hover:scale-110 hover:-translate-y-1 hover:shadow-[0_0_15px_rgba(99,102,241,0.5)] active:scale-95"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="https://muhammadsubhansiddiqui.me/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-800/80 text-gray-400 hover:bg-indigo-600 hover:text-white transition-all duration-300 hover:scale-110 hover:-translate-y-1 hover:shadow-[0_0_15px_rgba(99,102,241,0.5)] active:scale-95"
                aria-label="Portfolio"
              >
                <Globe className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-800/60 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-sm text-gray-500">
          <p>© {new Date().getFullYear()} AI eBook Creator. All rights reserved.</p>
          <p className="flex items-center justify-center sm:justify-start gap-1.5 text-gray-400">
            Crafted with <span className="text-red-500 animate-pulse">❤️</span> by{" "}
            <a
              href="https://muhammadsubhansiddiqui.me/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors hover:underline"
            >
              Muhammad Subhan Siddiqui
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;