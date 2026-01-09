'use client'
import React from 'react'
import { Github, Linkedin, Mail, ChevronDown } from 'lucide-react';

export default function Hero() {
  return (
    <section className="pt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left side - Text content */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold">
              Hi, I'm <span className="bg-gradient-to-r from-orange-700 to-amber-700 bg-clip-text text-transparent">Ralph Geo Santos</span>
            </h1>
            <p className="text-lg md:text-xl text-stone-600">
              4th year Computer Science| Full-Stack Developer | Problem solver | Tech Enthusiast
            </p>
            <div className="flex gap-4 pt-4">
              <a href="https://github.com/ralph12322" className="p-3 bg-stone-200 hover:bg-stone-300 rounded-full transition-colors">
                <Github className="w-6 h-6 text-stone-700" />
              </a>
              <a href="https://www.linkedin.com/in/ralph-geo-santos-49226b281/" className="p-3 bg-stone-200 hover:bg-stone-300 rounded-full transition-colors">
                <Linkedin className="w-6 h-6 text-stone-700" />
              </a>
              <a href="mailto:ralphgeosantos@gmail.com" className="p-3 bg-stone-200 hover:bg-stone-300 rounded-full transition-colors">
                <Mail className="w-6 h-6 text-stone-700" />
              </a>
            </div>
          </div>

          {/* Right side - Hero Image */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
              {/* Replace this src with your actual image path */}
              <img 
                src="./hero-me.png" 
                alt="Ralph Geo Santos" 
                className="w-full h-auto object-cover"
              />
              {/* Placeholder background - remove when you add your image */}
              {/* <div className="absolute inset-0 bg-gradient-to-br from-orange-600 to-amber-600 flex items-center justify-center">
                <span className="text-stone-50 text-8xl font-bold">RG</span>
              </div> */}
            </div>
            
            {/* Optional decorative element */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br from-orange-600 to-amber-600 rounded-2xl -z-10"></div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="text-center mt-16">
          <ChevronDown className="w-8 h-8 mx-auto animate-bounce text-orange-600" />
        </div>
      </div>
    </section>
  )
}