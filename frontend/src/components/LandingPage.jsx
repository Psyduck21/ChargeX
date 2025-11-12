import React, { useState, useEffect } from 'react';
import { Zap, MapPin, Clock, DollarSign, Shield, Users, TrendingUp, CheckCircle, Star, Menu, X, ChevronRight, Battery, Smartphone, CreditCard, Award, ArrowRight, Mail, Lock, User, Phone, Eye, EyeOff, Search, Command } from 'lucide-react';
import ProfessionalLogin from './login.jsx';
import EnhancedSignup from './signup.jsx';

export default function EVChargingLanding({ onSwitchToLogin, onSwitchToSignup, onLoggedIn }) {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [commandSearch, setCommandSearch] = useState('');
  const [scrollY, setScrollY] = useState(0);

  // Animated counters
  const [counters, setCounters] = useState({ users: 0, stations: 0, charges: 0 });
  const [hasAnimated, setHasAnimated] = useState(false);

  // Live ticker
  const [tickerIndex, setTickerIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const tickerMessages = [
    "🔋 Downtown Hub - 3 slots available now",
    "⚡ Airport Station - Fast charging available",
    "🚗 Mall Parking - Book now for evening slots",
    "🌟 City Center - Premium charging with amenities",
    "💚 Tech Park - Eco-friendly solar-powered charging"
  ];



  // Scroll handler
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Command palette
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowCommandPalette(true);
      }
      if (e.key === 'Escape') {
        setShowCommandPalette(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Animated counters
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          animateCounters();
        }
      },
      { threshold: 0.5 }
    );

    const target = document.getElementById('stats-section');
    if (target) observer.observe(target);

    return () => {
      if (target) observer.unobserve(target);
    };
  }, [hasAnimated]);

  const animateCounters = () => {
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    const targets = { users: 10000, stations: 500, charges: 50000 };
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      setCounters({
        users: Math.floor(targets.users * progress),
        stations: Math.floor(targets.stations * progress),
        charges: Math.floor(targets.charges * progress)
      });

      if (step >= steps) {
        clearInterval(timer);
        setCounters(targets);
      }
    }, interval);
  };

  // Live ticker rotation with smooth transitions
  useEffect(() => {
    const timer = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setTickerIndex((prev) => (prev + 1) % tickerMessages.length);
        setIsTransitioning(false);
      }, 300);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // Scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fadeInUp');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.scroll-animate').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);



  const showToast = (message, type) => {
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 z-50 px-6 py-4 rounded-xl shadow-2xl transform transition-all duration-300 ${
      type === 'success' ? 'bg-emerald-600' : 'bg-red-600'
    } text-white font-semibold animate-slideInRight`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('opacity-0', 'translate-x-full');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  };

  const CommandPalette = () => {
    if (!showCommandPalette) return null;

    const commands = [
      { name: 'Sign Up', action: () => { setShowSignup(true); setShowCommandPalette(false); }, icon: User },
      { name: 'Login', action: () => { setShowLogin(true); setShowCommandPalette(false); }, icon: Lock },
      { name: 'View Features', action: () => { document.getElementById('features').scrollIntoView({ behavior: 'smooth' }); setShowCommandPalette(false); }, icon: Star },
      { name: 'How It Works', action: () => { document.getElementById('how-it-works').scrollIntoView({ behavior: 'smooth' }); setShowCommandPalette(false); }, icon: Battery },
      { name: 'Testimonials', action: () => { document.getElementById('testimonials').scrollIntoView({ behavior: 'smooth' }); setShowCommandPalette(false); }, icon: Users },
    ];

    const filteredCommands = commands.filter(cmd =>
      cmd.name.toLowerCase().includes(commandSearch.toLowerCase())
    );

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start justify-center z-50 p-4 pt-20">
        <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl animate-slideUp">
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={commandSearch}
                onChange={(e) => setCommandSearch(e.target.value)}
                placeholder="Search commands..."
                className="w-full pl-10 pr-4 py-3 border-0 focus:outline-none text-lg"
                autoFocus
              />
            </div>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {filteredCommands.map((cmd, index) => (
              <button
                key={index}
                onClick={cmd.action}
                className="w-full px-6 py-4 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left"
              >
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <cmd.icon className="w-5 h-5 text-emerald-600" />
                </div>
                <span className="font-medium text-gray-900">{cmd.name}</span>
              </button>
            ))}
            {filteredCommands.length === 0 && (
              <div className="px-6 py-8 text-center text-gray-500">
                No commands found
              </div>
            )}
          </div>
          <div className="p-4 border-t border-gray-200 flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <kbd className="px-2 py-1 bg-gray-100 rounded border border-gray-300">⌘</kbd>
              <kbd className="px-2 py-1 bg-gray-100 rounded border border-gray-300">K</kbd>
              <span>to open</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="px-2 py-1 bg-gray-100 rounded border border-gray-300">ESC</kbd>
              <span>to close</span>
            </div>
          </div>
        </div>
      </div>
    );
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Live Availability Ticker */}
      <div className="fixed top-0 left-0 right-0 bg-emerald-600 text-white py-2 z-30 overflow-hidden">
        <div className="relative h-full flex items-center justify-center">
          <p
            className={`text-center text-sm font-medium transition-all duration-300 ${
              isTransitioning ? 'opacity-0 transform translate-y-1' : 'opacity-100 transform translate-y-0'
            }`}
          >
            {tickerMessages[tickerIndex]}
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-10 w-full bg-white/80 backdrop-blur-lg border-b border-gray-200 z-40 transition-all duration-300" style={{
        boxShadow: scrollY > 50 ? '0 4px 20px rgba(0,0,0,0.1)' : 'none'
      }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">ChargeX</span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">Features</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">How It Works</a>
              <a href="#testimonials" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">Testimonials</a>
              <button
                onClick={() => setShowLogin(true)}
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => setShowSignup(true)}
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-lg shadow-emerald-500/30 transform hover:scale-105"
              >
                Get Started
              </button>
              <button
                onClick={() => setShowCommandPalette(true)}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="Search (⌘K)"
              >
                <Command className="w-5 h-5" />
              </button>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-4 py-4 space-y-3">
              <a href="#features" className="block text-gray-600 hover:text-gray-900 font-medium py-2">Features</a>
              <a href="#how-it-works" className="block text-gray-600 hover:text-gray-900 font-medium py-2">How It Works</a>
              <a href="#testimonials" className="block text-gray-600 hover:text-gray-900 font-medium py-2">Testimonials</a>
              <button
                onClick={() => { setShowLogin(true); setMobileMenuOpen(false); }}
                className="block w-full text-left text-gray-600 hover:text-gray-900 font-medium py-2"
              >
                Login
              </button>
              <button
                onClick={() => { setShowSignup(true); setMobileMenuOpen(false); }}
                className="block w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-2.5 rounded-xl font-semibold text-center"
              >
                Get Started
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-44 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="scroll-animate opacity-0">
              <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-semibold mb-6 animate-pulse">
                <Zap className="w-4 h-4" />
                The Future of EV Charging
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Find & Book
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-emerald-600 animate-gradient">
                  EV Charging Stations
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Discover nearby charging stations, book your slot in advance, and charge your electric vehicle hassle-free. Join the sustainable transportation revolution today!
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setShowSignup(true)}
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all transform hover:scale-105 shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 ripple"
                >
                  Sign Up Free
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setShowLogin(true)}
                  className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold hover:border-gray-400 hover:bg-gray-50 transition-all transform hover:scale-105"
                >
                  Login
                </button>
              </div>
              <div id="stats-section" className="flex items-center gap-8 mt-12">
                <div className="transform hover:scale-110 transition-transform">
                  <div className="text-3xl font-bold text-gray-900">{counters.users.toLocaleString()}+</div>
                  <div className="text-sm text-gray-600">Active Users</div>
                </div>
                <div className="transform hover:scale-110 transition-transform">
                  <div className="text-3xl font-bold text-gray-900">{counters.stations}+</div>
                  <div className="text-sm text-gray-600">Stations</div>
                </div>
                <div className="transform hover:scale-110 transition-transform">
                  <div className="text-3xl font-bold text-gray-900">{counters.charges.toLocaleString()}+</div>
                  <div className="text-sm text-gray-600">Charges</div>
                </div>
              </div>
            </div>
            <div className="relative scroll-animate opacity-0">
              <div className="relative z-10 animate-float">
                <img
                  src="https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&h=600&fit=crop"
                  alt="EV Charging"
                  className="rounded-3xl shadow-2xl"
                />
              </div>
              <div className="absolute top-10 -right-10 w-72 h-72 bg-emerald-200 rounded-full blur-3xl opacity-50 animate-pulse"></div>
              <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-blue-200 rounded-full blur-3xl opacity-50 animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 scroll-animate opacity-0">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose ChargeX?</h2>
            <p className="text-xl text-gray-600">Everything you need for seamless EV charging experience</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: MapPin,
                title: 'Find Stations Nearby',
                description: 'Easily locate charging stations near you with our interactive map and real-time availability updates.',
                color: 'from-emerald-500 to-emerald-600'
              },
              {
                icon: Clock,
                title: 'Book Your Slot',
                description: 'Reserve your charging slot in advance and skip the wait. Perfect for planning your trips.',
                color: 'from-blue-500 to-blue-600'
              },
              {
                icon: DollarSign,
                title: 'Transparent Pricing',
                description: 'See clear pricing before booking. No hidden fees, no surprises. Pay only for what you use.',
                color: 'from-purple-500 to-purple-600'
              },
              {
                icon: Shield,
                title: 'Secure & Safe',
                description: 'Your data and payments are protected with bank-level encryption and secure payment gateways.',
                color: 'from-orange-500 to-orange-600'
              },
              {
                icon: Smartphone,
                title: 'Easy to Use',
                description: 'Intuitive mobile app with simple booking process. Find, book, and charge in just a few taps.',
                color: 'from-pink-500 to-pink-600'
              },
              {
                icon: TrendingUp,
                title: 'Track Your History',
                description: 'View your charging history, track spending, and monitor your environmental impact over time.',
                color: 'from-indigo-500 to-indigo-600'
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="scroll-animate opacity-0 bg-gray-50 rounded-2xl p-8 hover:shadow-xl transition-all transform hover:-translate-y-2 group cursor-pointer"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform group-hover:rotate-6`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Get started in three simple steps</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Sign Up',
                description: 'Create your free account in less than a minute. No credit card required to get started.',
                icon: User
              },
              {
                step: '02',
                title: 'Find & Book Station',
                description: 'Search for nearby charging stations, check real-time availability, and book your preferred time slot.',
                icon: MapPin
              },
              {
                step: '03',
                title: 'Charge Your EV',
                description: 'Drive to the station, plug in your vehicle, and charge. Pay securely through the app when done.',
                icon: Battery
              }
            ].map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all">
                  <div className="text-6xl font-bold text-emerald-100 mb-4">{step.step}</div>
                  <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mb-6">
                    <step.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ChevronRight className="w-8 h-8 text-emerald-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
            <p className="text-xl text-gray-600">Join thousands of satisfied EV owners</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Sarah Johnson',
                role: 'Tesla Model 3 Owner',
                image: 'https://i.pravatar.cc/150?img=1',
                rating: 5,
                text: 'ChargeX has made my daily commute so much easier. I can always find a station and book in advance. Highly recommended!'
              },
              {
                name: 'Michael Chen',
                role: 'Nissan Leaf Driver',
                image: 'https://i.pravatar.cc/150?img=2',
                rating: 5,
                text: 'The app is intuitive and the pricing is transparent. I love how I can track my charging history and environmental impact.'
              },
              {
                name: 'Emily Rodriguez',
                role: 'BMW i4 Owner',
                image: 'https://i.pravatar.cc/150?img=3',
                rating: 5,
                text: 'Premium support is excellent! The priority booking feature saves me so much time. Worth every penny.'
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all">
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed">"{testimonial.text}"</p>
                <div className="flex items-center gap-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-emerald-500 to-emerald-600">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { value: '10,000+', label: 'Happy Users' },
              { value: '500+', label: 'Charging Stations' },
              { value: '50,000+', label: 'Charges Completed' },
              { value: '99.9%', label: 'Uptime' }
            ].map((stat, index) => (
              <div key={index} className="text-white">
                <div className="text-5xl font-bold mb-2">{stat.value}</div>
                <div className="text-emerald-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Ready to Start Charging Smarter?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of EV owners who trust ChargeX for convenient, reliable charging solutions
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setShowSignup(true)}
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-10 py-4 rounded-xl font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all transform hover:scale-[1.02] shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2"
            >
              Create Free Account
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowLogin(true)}
              className="border-2 border-gray-300 text-gray-700 px-10 py-4 rounded-xl font-semibold hover:border-gray-400 hover:bg-gray-50 transition-all"
            >
              Login to Your Account
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold">ChargeX</span>
              </div>
              <p className="text-gray-400">
                Making EV charging accessible, reliable, and sustainable for everyone.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Mobile App</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">GDPR</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-gray-400">© 2024 ChargeX. All rights reserved.</p>
            <div className="flex items-center gap-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm4.441 16.892c-2.102.144-6.784.144-8.883 0C5.282 16.736 5.017 15.622 5 12c.017-3.629.285-4.736 2.558-4.892 2.099-.144 6.782-.144 8.883 0C18.718 7.264 18.982 8.378 19 12c-.018 3.629-.285 4.736-2.559 4.892zM10 9.658l4.917 2.338L10 14.342V9.658z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>

      <CommandPalette />

      {/* Import and render the modal components */}
      {showLogin && (
        <ProfessionalLogin
          onSwitchToSignup={() => {
            setShowLogin(false);
            setShowSignup(true);
          }}
          onLoggedIn={async (data) => {
            setShowLogin(false);
            await onLoggedIn(data);
          }}
        />
      )}

      {showSignup && (
        <EnhancedSignup
          onSwitchToLogin={() => {
            setShowSignup(false);
            setShowLogin(true);
          }}
          onSignupSuccess={onLoggedIn}
        />
      )}

      <style>{`
        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @keyframes slideInLeft {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
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
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
        .animate-slideInLeft {
          animation: slideInLeft 1s ease-out infinite;
        }
        .animate-slideInRight {
          animation: slideInRight 0.3s ease-out;
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        .scroll-animate {
          transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }
        .ripple {
          position: relative;
          overflow: hidden;
        }
        .ripple:before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.5);
          transform: translate(-50%, -50%);
          transition: width 0.6s, height 0.6s;
        }
        .ripple:hover:before {
          width: 300px;
          height: 300px;
        }
      `}</style>
    </div>
  );
}
