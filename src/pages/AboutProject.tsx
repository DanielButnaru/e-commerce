import React from "react";
import {
  Code,
  Database,
  Globe,
  Shield,
  Zap,
  Users,
  ArrowLeft,
  ExternalLink,
  Github,
  Calendar,
  Target,
  Lightbulb,
} from "lucide-react";
import { Link } from "react-router-dom";

const AboutProject = () => {
  const features = [
    {
      icon: <Code className="w-8 h-8" />,
      title: "Frontend Development",
      description:
        "Modern UI built with React and TypeScript, styled using Tailwind CSS and animated with Framer Motion",
    },
    {
      icon: <Database className="w-8 h-8" />,
      title: "Real-Time Backend",
      description:
        "Firestore database integration for real-time data sync, document-based modeling and instant updates",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Authentication & Security",
      description:
        "Firebase Authentication with secure email/password sign-in and user session management",
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Performance Optimization",
      description:
        "Optimized component structure, lazy loading, and efficient state handling for smooth interactions",
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Responsive Design",
      description:
        "Mobile-first layout using utility-first CSS for a seamless experience across devices",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "User Experience",
      description:
        "Minimalist, intuitive design with clear navigation and user-focused flows",
    },
  ];

  const projectInfo = [
    {
      icon: <Target className="w-6 h-6" />,
      title: "Project Goal",
      description:
        "Build a complete e-commerce interface with real-time database and secure user access using Firebase",
    },
    {
      icon: <Lightbulb className="w-6 h-6" />,
      title: "Key Challenge",
      description:
        "Structuring a Firebase-first architecture while maintaining clean code, performance, and design quality",
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Development Timeline",
      description:
        "Work in progress – core features implemented within a few weeks as part of a larger learning project",
    },
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 overflow-hidden">
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

      {/* Main Content */}
      <div className="relative z-10 px-4 py-8">
        {/* Header with Back Button */}
        <div className="max-w-6xl mx-auto mb-12">
          <Link
            to="/"
            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </Link>

          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6">
              E-Commerce
              <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                Demo Project
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              A full-stack web application demonstrating modern development
              practices, clean architecture, and contemporary design patterns in
              e-commerce.
            </p>
          </div>
        </div>

        {/* Project Overview */}
        <div className="max-w-6xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
            Project Overview
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {projectInfo.map((info, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-6 hover:bg-white/15 transition-all duration-300"
              >
                <div className="text-purple-400 mb-4">{info.icon}</div>
                <h3 className="text-lg font-bold text-white mb-3">
                  {info.title}
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {info.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Technical Implementation */}
        <div className="max-w-6xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
            Technical Implementation
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/15 transition-all duration-300 hover:scale-105 group"
              >
                <div className="text-purple-400 mb-4 group-hover:text-pink-400 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Technology Stack */}
        <div className="max-w-6xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
            Technology Stack
          </h2>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">Frontend</h3>
                <div className="space-y-2 text-gray-300">
                  <p>React 18 + Vite</p>
                  <p>TypeScript</p>
                  <p>Tailwind CSS</p>
                  <p>Framer Motion</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto">
                  <Code className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">Backend</h3>
                <div className="space-y-2 text-gray-300">
                  <p>Node.js</p>
                  <p>Express.js</p>
                  <p>RESTful APIs</p>
                  <p>JWT Authentication</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center mx-auto">
                  <Database className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">Database</h3>
                <div className="space-y-2 text-gray-300">
                  <p>Firebase Authentication</p>
                  <p>Cloud Firestore</p>
                  <p>Firebase SDK</p>
                  <p>Firebase Hosting</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Project Links */}
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
            View the Project
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/login"
              className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 shadow-xl"
            >
              <ExternalLink className="w-5 h-5" />
              Explore Demo
            </Link>
            <Link
              to="https://github.com/DanielButnaru/e-commerce"
              className="flex items-center justify-center gap-2 px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-gray-900 transition-all duration-300"
            >
              <Github className="w-5 h-5" />
              Source Code
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutProject;
