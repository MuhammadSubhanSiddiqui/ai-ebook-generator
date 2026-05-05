import React from 'react';
import { BookOpen, Github, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 py-12 text-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-blue-400" />
              <span className="text-xl font-bold">AI eBook Creator</span>
            </div>
            <p className="text-gray-400">
              Empowering writers with Artificial Intelligence.
            </p>
          </div>
          
          <div>
            <h3 className="mb-4 font-semibold text-gray-100">Product</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#features" className="hover:text-blue-400">Features</a></li>
              <li><a href="#" className="hover:text-blue-400">Pricing</a></li>
              <li><a href="#" className="hover:text-blue-400">Roadmap</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="mb-4 font-semibold text-gray-100">Company</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-blue-400">About</a></li>
              <li><a href="#" className="hover:text-blue-400">Blog</a></li>
              <li><a href="#" className="hover:text-blue-400">Contact</a></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-gray-100">Follow Us</h3>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-white"><Github className="h-5 w-5" /></a>
              <a href="#" className="text-gray-400 hover:text-white"><Twitter className="h-5 w-5" /></a>
              <a href="#" className="text-gray-400 hover:text-white"><Linkedin className="h-5 w-5" /></a>
            </div>
          </div>
        </div>
        
        <div className="mt-12 border-t border-gray-800 pt-8 text-center text-gray-500">
          <p>© {new Date().getFullYear()} AI eBook Creator. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;