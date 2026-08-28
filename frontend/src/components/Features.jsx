import React from 'react';
import { Bot, FileText, Download, LayoutTemplate, PenTool, Layers } from 'lucide-react';

const features = [
  {
    icon: <Bot className="h-6 w-6 text-white" />,
    title: "AI Outline Architect",
    description: "Generate structured table of contents, chapter breakdown, and thematic continuity in seconds.",
    gradient: "from-purple-500 to-indigo-600",
  },
  {
    icon: <PenTool className="h-6 w-6 text-white" />,
    title: "Prose & Chapter Writer",
    description: "Instantly draft comprehensive, in-depth prose powered by Google Gemini AI.",
    gradient: "from-blue-500 to-cyan-600",
  },
  {
    icon: <FileText className="h-6 w-6 text-white" />,
    title: "Editorial Customizer",
    description: "Refine chapter text, update book titles, and fine-tune your eBook with real-time editing.",
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    icon: <LayoutTemplate className="h-6 w-6 text-white" />,
    title: "Live Reader Preview",
    description: "Read your generated chapters in a book layout with page turns and dark mode support.",
    gradient: "from-amber-500 to-orange-600",
  },
  {
    icon: <Download className="h-6 w-6 text-white" />,
    title: "Publishable PDF Export",
    description: "Export clean PDFs featuring formatted cover pages, table of contents, and running headers/footers.",
    gradient: "from-rose-500 to-pink-600",
  },
  {
    icon: <Layers className="h-6 w-6 text-white" />,
    title: "Drag & Drop Structuring",
    description: "Reorder chapters seamlessly to craft the narrative pacing and flow you envision.",
    gradient: "from-indigo-500 to-purple-600",
  }
];

const Features = () => {
  return (
    <section id="features" className="bg-slate-50 py-24 transition-colors duration-200 dark:bg-[#0c101d]">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-16 text-center">
          <div className="inline-flex items-center rounded-full bg-indigo-50 px-3.5 py-1 text-xs font-semibold text-indigo-600 mb-3 dark:bg-indigo-950/80 dark:text-indigo-400">
            Platform Capabilities
          </div>
          <h2 className="font-serif text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl md:text-5xl dark:text-white">
            Everything Required to Publish Quality Books
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto dark:text-gray-300">
            From prompt concept to formatted PDF export, we streamline the publishing workflow so you can share your knowledge effortlessly.
          </p>
        </div>

        <div className="grid gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative rounded-2xl border border-gray-200/80 bg-white p-7 sm:p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 dark:border-gray-800 dark:bg-gray-900/80 overflow-hidden"
            >
              {/* Subtle top hover line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 from-indigo-500 via-purple-500 to-pink-500"></div>

              <div
                className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr ${feature.gradient} transform group-hover:scale-110 transition-all duration-300 shadow-md`}
              >
                {feature.icon}
              </div>
              <h3 className="mb-2.5 text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors duration-200 dark:text-white dark:group-hover:text-indigo-400">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed dark:text-gray-300">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;