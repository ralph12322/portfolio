'use client';
import React, { useState } from 'react';
import { Github, Linkedin, Facebook, Mail, ExternalLink, Code, Database, Globe, ChevronDown, Link } from 'lucide-react';
import Hero from './components/hero';

export default function Portfolio() {
  const [activeSection, setActiveSection] = useState('about');
  const [isOpen, setIsOpen] = useState(false);

  const projects = [
    {
      title: "TrackTag | Thesis Project",
      description: "Designed and deployed a full-stack price tracking platform that monitors apparel prices and reviews from Amazon and Lazada using automated web scraping.",
      tech: ["Next.js", "TypeScript", "Node.js", "MongoDB"],
      github: "https://github.com/ralph12322/tracktag",
      demo: "https://tracktag-production.up.railway.app/"
    },
    {
      title: "Spotify Clone | Hubby Project",
      description: "Developed a responsive music streaming web application inspired by Spotify's UI and core user experience.",
      tech: ["React", "Node.js", "JavaScript", "Tailwind CSS", "Cloudinary", "MongoDB"],
      github: "https://github.com/ralph12322/Spotify-Clone",
      demo: "https://lindsaaayspoti.vercel.app/"
    },
    {
      title: "EmoVOX | Baby-Thesis Project",
      description: "Created an end-to-end ML pipeline for image classification with data preprocessing, model training, and deployment infrastructure.",
      tech: ["React", "Node.js", "Express", "Tailwind CSS"],
      github: "#",
      demo: "https://emovox.vercel.app/"
    }
  ];

  const skills = {
    "Languages": ["Python", "JavaScript", "TypeScript"],
    "Web": ["React", "Next.js", "Node.js", "Express"],
    "Database": ["MongoDB"],
    "Tools & Other": ["Git"]
  };

  const experience = [
    {
      role: "Software Engineering Intern",
      company: "Tech Company",
      period: "Summer 2024",
      description: "Developed microservices and improved system performance by 40% through optimization."
    },
    {
      role: "Research Assistant",
      company: "University Lab",
      period: "2023 - Present",
      description: "Conducting research in distributed systems and contributing to open-source projects."
    }
  ];

  const navigations = [
    { title: 'about', link: '#about', scroll: true },
    { title: 'projects', link: '#projects', scroll: true },
    { title: 'experience', link: '#experience', scroll: true },
    { title: 'contact', link: '#contact', scroll: true },
    { title: 'resume', link: '/resume.pdf', scroll: false }
  ];



  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-stone-100 to-amber-50 text-stone-800">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-stone-50/90 backdrop-blur-sm z-50 border-b border-stone-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo / Brand */}
            <div className="flex-shrink-0 font-bold text-xl text-stone-800">
              DeRalph
            </div>

            {/* Desktop Links */}
            <div className="hidden md:flex gap-6 items-center">
              {navigations.map((nav) =>
                nav.scroll ? (
                  <button
                    key={nav.title}
                    onClick={() => {
                      const section = document.querySelector(nav.link);
                      if (section) {
                        section.scrollIntoView({ behavior: "smooth" });
                        setActiveSection(nav.title);
                      }
                    }}
                    className={`capitalize transition-colors ${activeSection === nav.title
                      ? "text-orange-700"
                      : "text-stone-600 hover:text-stone-900"
                      }`}
                  >
                    {nav.title}
                  </button>
                ) : (
                  <a
                    key={nav.title}
                    href={nav.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="capitalize transition-colors text-stone-600 hover:text-stone-900 px-2 py-1"
                  >
                    {nav.title}
                  </a>
                )
              )}
            </div>

            {/* Mobile Hamburger */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-stone-800 focus:outline-none"
              >
                {isOpen ? "✖" : "☰"}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-stone-50 border-t border-stone-300">
            <div className="flex flex-col p-4 gap-4">
              {navigations.map((nav) =>
                nav.scroll ? (
                  <button
                    key={nav.title}
                    onClick={() => {
                      const section = document.querySelector(nav.link);
                      if (section) {
                        section.scrollIntoView({ behavior: "smooth" });
                        setActiveSection(nav.title);
                        setIsOpen(false); // close menu on click
                      }
                    }}
                    className={`capitalize transition-colors text-left px-2 py-2 w-full ${activeSection === nav.title
                      ? "text-orange-700"
                      : "text-stone-600 hover:text-stone-900"
                      }`}
                  >
                    {nav.title}
                  </button>
                ) : (
                  <a
                    key={nav.title}
                    href={nav.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="capitalize transition-colors text-left px-2 py-2 w-full text-stone-600 hover:text-stone-900"
                  >
                    {nav.title}
                  </a>
                )
              )}
            </div>
          </div>
        )}

      </nav>

      {/* Hero Section */}
      <Hero />

      {/* About Section */}
      <section id="about" className="py-20 px-6 bg-stone-100">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">About Me</h2>
          <div className="grid md:grid-cols-2 gap-40">
            <div className="border-2 border-orange-600 rounded-lg p-6 bg-stone-50 shadow-lg">
              <p className="text-stone-600 text-lg leading-relaxed mb-6">
                I'm a fourth-year Computer Science student seeking an internship where I can apply my skills in building scalable systems and solving real-world engineering problems. I have hands-on experience in full-stack development, MVC architecture, and version control, and I’m eager to contribute to a professional development team while continuing to grow my technical expertise.
              </p>
              <p className="text-stone-600 text-lg leading-relaxed">
                Currently seeking full-time opportunities where I can contribute to meaningful projects and continue growing as a programmer.
              </p>
            </div>
            <div className="space-y-6">
              {Object.entries(skills).map(([category, items]) => (
                <div key={category}>
                  <h3 className="text-orange-700 font-semibold mb-3 flex items-center gap-2">
                    <Code className="w-5 h-5" />
                    {category}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {items.map((skill) => (
                      <span key={skill} className="px-3 py-1 bg-stone-200 rounded-full text-sm text-stone-700">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id='projects' className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Featured Projects</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, idx) => (
              <div key={idx} className="bg-stone-50 backdrop-blur rounded-lg p-6 border border-stone-300 hover:border-orange-400 transition-all hover:transform hover:scale-105 shadow-sm hover:shadow-md">
                <h3 className="text-xl font-bold mb-3 text-orange-700">{project.title}</h3>
                <p className="text-stone-600 mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tech.map((tech) => (
                    <span key={tech} className="px-2 py-1 bg-stone-200 rounded text-xs text-stone-700">
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex gap-4">
                  <a href={project.github} className="flex items-center gap-1 text-sm text-orange-700 hover:text-orange-600">
                    <Github className="w-4 h-4" /> Code
                  </a>
                  <a href={project.demo} className="flex items-center gap-1 text-sm text-orange-700 hover:text-orange-600">
                    <ExternalLink className="w-4 h-4" /> Demo
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-20 px-6 bg-stone-100">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Experience</h2>
          <div className="space-y-6 text-center py-12">
            <div className="bg-stone-50 border border-stone-300 rounded-xl shadow-md p-8">
              <p className="text-stone-600 text-lg">
                Currently building skills and gaining practical knowledge in web development and software engineering.
                Let's collaborate so that i can put my skills to good use!
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Contact Section */}
      <section id='contact' className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Let's Connect</h2>
          <p className="text-xl text-stone-600 mb-8">
            I'm currently looking for Internship opportunities. Feel free to reach out! <br /><Mail className="w-4 h-4 inline" /> <a href="mailto:gjcshs.santos.ralphgeo@gmail.com?subject=Hello&body=I%20would%20like%20to%20connect%20with%20you.">gjcshs.santos.ralphgeo@gmail.com</a> <br /><Facebook className="w-4 h-4 inline" /> <a href="https://www.facebook.com/ralph.santos.620659/">Ralph Geo Santos</a>
          </p>
          <a
            href="https://mail.google.com/mail/?view=cm&to=gjcshs.santos.ralphgeo@gmail.com&su=Hello&body=I%20would%20like%20to%20connect%20with%20you."
            className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-600 to-amber-600 px-8 py-4 rounded-full text-lg font-semibold hover:opacity-90 transition-opacity text-stone-50"
          >
            <Mail className="w-5 h-5" />
            Get In Touch
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-stone-300 text-center text-stone-500">
        <p>© 2025 Ralph Geo Santos. Built with Next.js & Tailwind CSS</p>
      </footer>
    </div>
  );
}