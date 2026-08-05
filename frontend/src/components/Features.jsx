import React from 'react';
import { Bot, FileText, Download, LayoutTemplate, PenTool, Layers } from 'lucide-react';

const features = [
  {
    icon: <Bot className="h-6 w-6 text-white" />,
    title: "AI Outline Generator",
    description: "Create a complete ebook outline with chapter titles and detailed descriptions in seconds.",
    color: "bg-purple-500"
  },
  {
    icon: <PenTool className="h-6 w-6 text-white" />,
    title: "AI Chapter Writer",
    description: "Instantly generate full chapter content powered by Google Gemini AI.",
    color: "bg-blue-500"
  },
  {
    icon: <FileText className="h-6 w-6 text-white" />,
    title: "Markdown Editor",
    description: "Write and format content using a clean, distraction-free modern Markdown editor.",
    color: "bg-green-500"
  },
  {
    icon: <LayoutTemplate className="h-6 w-6 text-white" />,
    title: "Real-Time Preview",
    description: "Switch between edit and preview modes to see your formatted book instantly.",
    color: "bg-orange-500"
  },
  {
    icon: <Download className="h-6 w-6 text-white" />,
    title: "Easy Export",
    description: "Download your finished ebooks as professional PDF or Word (DOCX) files.",
    color: "bg-red-500"
  },
  {
    icon: <Layers className="h-6 w-6 text-white" />,
    title: "Drag & Drop Organizing",
    description: "Reorder chapters easily for flexible ebook structuring and flow management.",
    color: "bg-indigo-500"
  }
];

const Features = () => {
  return (
    <section id="features" className="bg-gray-50 py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need to create a book
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            From brainstorming to exporting, we handle the technical side so you can focus on writing.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div key={index} className="rounded-xl bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg ${feature.color}`}>
                {feature.icon}
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-900">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;