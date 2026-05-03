// resources/js/pages/welcome.jsx

import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function Welcome() {
  const { auth } = usePage().props;
  const [scrolled, setScrolled] = useState(false);
  const [activeFeature, setActiveFeature] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Animated Header */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-white/90 backdrop-blur-lg shadow-lg' : 'bg-transparent'
        }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Animated Logo */}
            <div className="flex items-center gap-2 group cursor-pointer">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
                <div className="relative w-8 h-8 bg-linear-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white font-bold text-lg">JM</span>
                </div>
              </div>
              <h1 className="text-2xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Job Match
              </h1>
            </div>

            {/* Auth Buttons with animations */}
            <div className="flex gap-3">
              {auth.user ? (
                <Link
                  href={route('dashboard')}
                  className="relative px-5 py-2 text-sm font-medium text-white bg-linear-to-r from-blue-500 to-indigo-600 rounded-lg overflow-hidden group"
                >
                  <span className="relative z-10">Dashboard</span>
                  <div className="absolute inset-0 bg-linear-to-r from-blue-600 to-indigo-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                </Link>
              ) : (
                <>
                  <Link
                    href={route('login')}
                    className="px-5 py-2 text-sm font-medium text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-300 hover:scale-105"
                  >
                    Log in
                  </Link>
                  <Link
                    href={route('register')}
                    className="relative px-5 py-2 text-sm font-medium text-white bg-linear-to-r from-blue-500 to-indigo-600 rounded-lg overflow-hidden group hover:shadow-lg transition-all duration-300 hover:scale-105"
                  >
                    <span className="relative z-10">Sign up</span>
                    <div className="absolute inset-0 bg-linear-to-r from-blue-600 to-indigo-700 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section with animations */}
      <main className="pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Animated hero content */}
          <div className="text-center animate-fade-in-up">
            <div className="inline-block mb-4">
              <div className="bg-blue-100 text-blue-600 px-4 py-1 rounded-full text-sm font-semibold animate-pulse">
                🎯 Find Your Perfect Match
              </div>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Your Next Great
              <span className="bg-linear-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent"> Career Move</span>
              <br />
              Starts Here
            </h2>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
              Join thousands of professionals who found their dream jobs through Job Match.
              Your perfect opportunity is waiting.
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href={route('register')}
                className="group relative px-8 py-3 text-white bg-linear-to-r from-blue-500 to-indigo-600 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <span className="relative z-10 font-semibold">Get Started Free →</span>
                <div className="absolute inset-0 bg-linear-to-r from-blue-600 to-indigo-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </Link>
              <Link
                href={route('public.jobs.index')}
                className="px-8 py-3 text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-300 hover:scale-105 font-semibold"
              >
                Browse Jobs
              </Link>
            </div>
          </div>

          {/* Stats Section with animation on scroll */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 animate-fade-in-up animation-delay-200">
            {[
              { number: "10K+", label: "Active Jobs", icon: "💼" },
              { number: "5K+", label: "Companies", icon: "🏢" },
              { number: "50K+", label: "Happy Users", icon: "😊" },
              { number: "95%", label: "Success Rate", icon: "📈" }
            ].map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="text-4xl mb-2 transform group-hover:scale-110 transition-transform duration-300">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Features Section with hover animations */}
          <div className="mt-32">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Job Match?</h3>
              <p className="text-gray-600 max-w-2xl mx-auto">We make job searching simple, fast, and effective</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: "🎯",
                  title: "Smart Matching",
                  description: "Our AI algorithm matches you with jobs that fit your skills and preferences perfectly.",
                  color: "from-blue-500 to-cyan-500"
                },
                {
                  icon: "⚡",
                  title: "Quick Apply",
                  description: "Apply to multiple jobs instantly with your saved profile and resume.",
                  color: "from-indigo-500 to-purple-500"
                },
                {
                  icon: "🔒",
                  title: "Secure & Private",
                  description: "Your data is protected with enterprise-grade security and privacy controls.",
                  color: "from-purple-500 to-pink-500"
                }
              ].map((feature, index) => (
                <div
                  key={index}
                  className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer"
                  onMouseEnter={() => setActiveFeature(index)}
                  onMouseLeave={() => setActiveFeature(null)}
                >
                  <div className={`absolute inset-0 bg-linear-to-r ${feature.color} rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                  <div className="relative">
                    <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300 inline-block">
                      {feature.icon}
                    </div>
                    <h4 className="text-xl font-semibold mb-3 text-gray-900">{feature.title}</h4>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                    {activeFeature === index && (
                      <div className="mt-4 text-blue-600 font-semibold animate-slide-in">
                        Learn more →
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section with parallax effect */}
          <div className="relative mt-32 rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-r from-blue-600 to-indigo-700 opacity-90"></div>
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center mix-blend-overlay"></div>
            <div className="relative py-16 px-8 text-center">
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Start Your Journey?
              </h3>
              <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
                Join thousands of job seekers who found their dream careers through Job Match
              </p>
              <Link
                href={route('register')}
                className="inline-block px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                Create Free Account
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Animated Footer */}
      <footer className="bg-gray-900 text-white mt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-linear-to-r from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center">
                  <span className="font-bold">JM</span>
                </div>
                <h4 className="text-xl font-bold">Job Match</h4>
              </div>
              <p className="text-gray-400 text-sm">Find your dream job with the perfect match.</p>
            </div>
            <div>
              <h5 className="font-semibold mb-4">For Job Seekers</h5>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="#" className="hover:text-white transition">Browse Jobs</Link></li>
                <li><Link href="#" className="hover:text-white transition">Career Advice</Link></li>
                <li><Link href="#" className="hover:text-white transition">Salary Calculator</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">For Employers</h5>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="#" className="hover:text-white transition">Post a Job</Link></li>
                <li><Link href="#" className="hover:text-white transition">Find Talent</Link></li>
                <li><Link href="#" className="hover:text-white transition">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Connect</h5>
              <div className="flex gap-4">
                {['📘', '🐦', '💼', '📷'].map((icon, i) => (
                  <div key={i} className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 cursor-pointer transition-all duration-300 hover:scale-110">
                    <span className="text-xl">{icon}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            © 2024 Job Match. All rights reserved. Made with ❤️ for job seekers.
          </div>
        </div>
      </footer>

      <style jsx>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateX(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                
                .animate-fade-in-up {
                    animation: fadeInUp 0.8s ease-out;
                }
                
                .animate-slide-in {
                    animation: slideIn 0.3s ease-out;
                }
                
                .animation-delay-200 {
                    animation-delay: 0.2s;
                }
                
                .animation-delay-400 {
                    animation-delay: 0.4s;
                }
            `}</style>
    </div>
  );
}