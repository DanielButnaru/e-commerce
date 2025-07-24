import React, { useState, useEffect } from "react";
import { ShoppingBag, Zap, Shield, Users } from "lucide-react";
import { Link } from "react-router-dom";

const OnBoarding = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const techStack = [
    "REACT",
    "TYPESCRIPT",
    "TAILWIND",
    "NODE.JS",
    "MONGODB",
    "EXPRESS",
  ];

const features = [
  {
    icon: <Shield className="w-6 h-6" />,
    text: "Secure Auth with Firebase"
  },
  {
    icon: <ShoppingBag className="w-6 h-6" />,
    text: "Dynamic Product Listing"
  },
  {
    icon: <Zap className="w-6 h-6" />,
    text: "Responsive Shopping Cart"
  },
  {
    icon: <Users className="w-6 h-6" />,
    text: "User-Friendly UX/UI"
  }
];


  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % techStack.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 overflow-hidden">

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
      

        {/* Main Heading */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight">
          Demo E-Commerce App
       </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl leading-relaxed">
          A modern e-commerce demo app built with React, TypeScript, and
          Firebase, designed to offer a smooth and intuitive shopping
          experience. Includes user authentication, product browsing, and a
          responsive shopping cart — all styled with Tailwind CSS.
        </p>

        {/* Features Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center p-4 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-all duration-300 hover:scale-105"
            >
              <div className="text-purple-400 mb-2">{feature.icon}</div>
              <span className="text-white text-sm font-medium">
                {feature.text}
              </span>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/login" className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-purple-500/25">
            Explore Demo
          </Link>
          <Link to="/about" className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-gray-900 transition-all duration-300">
            Project Details
          </Link >
        </div>

        {/* Current Tech Display */}
        <div className="mt-12 text-center">

          <div className="text-2xl md:text-3xl font-bold text-white bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">
            {techStack[currentSlide]}
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {techStack.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentSlide ? "bg-white scale-125" : "bg-white/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default OnBoarding;
