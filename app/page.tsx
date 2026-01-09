'use client';
import React, { useState } from 'react';
import { Github, Linkedin, Facebook, Mail, ExternalLink, Code, Database, Globe, ChevronDown } from 'lucide-react';
import Hero from './components/hero';

export default function Portfolio() {
  const [activeSection, setActiveSection] = useState('about');

  const projects = [
    {
      title: "TrackTag | Thesis Project)",
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
    "Languages": ["Python", "JavaScript", "TypeScript", "Java"],
    "Web": ["React", "Next.js", "Node.js", "Express", "FastAPI"],
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-stone-100 to-amber-50 text-stone-800">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-stone-50/90 backdrop-blur-sm z-50 border-b border-stone-300">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold bg-gradient-to-r from-orange-700 to-amber-700 bg-clip-text text-transparent">
            Ralph Geo Santos
          </h1>
          <div className="flex gap-6">
            {['about', 'projects', 'experience', 'contact'].map((section) => (
              <button
                key={section}
                onClick={() => {
                  setActiveSection(section);
                  document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`capitalize transition-colors ${activeSection === section ? 'text-orange-700' : 'text-stone-600 hover:text-stone-900'
                  }`}
              >
                {section}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <Hero />

      {/* About Section */}
      <section id="about" className="py-20 px-6 bg-stone-100">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">About Me</h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <p className="text-stone-600 text-lg leading-relaxed mb-6">
                I'm a fourth-year Computer Science student passionate about building scalable systems and solving complex problems.
                My experience spans full-stack development, distributed systems, and machine learning.
              </p>
              <p className="text-stone-600 text-lg leading-relaxed">
                Currently seeking full-time opportunities where I can contribute to meaningful projects and continue growing as a software engineer.
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
          <div className="space-y-8">
            {experience.map((exp, idx) => (
              <div key={idx} className="border-l-2 border-orange-600 pl-6 pb-8">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-2">
                  <div>
                    <h3 className="text-xl font-bold text-orange-700">{exp.role}</h3>
                    <p className="text-stone-500">{exp.company}</p>
                  </div>
                  <span className="text-sm text-stone-500 mt-1 md:mt-0">{exp.period}</span>
                </div>
                <p className="text-stone-600">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id='contact' className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Let's Connect</h2>
          <p className="text-xl text-stone-600 mb-8">
            I'm currently looking for Internship opportunities. Feel free to reach out! <br /><Mail className="w-4 h-4 inline" /> <a href="mailto:gjcshs.santos.ralphgeo@gmail.com">gjcshs.santos.ralphgeo@gmail.com</a> <br /><Facebook className="w-4 h-4 inline" /> <a href="https://www.facebook.com/ralph.santos.620659/">Ralph Geo Santos</a>
          </p>
          <a
            href="mailto:gjcshs.santos.ralphgeo@gmail.com"
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