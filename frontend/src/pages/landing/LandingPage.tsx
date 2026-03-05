import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sprout, Home, Info, Layers, Mail, Menu, X,
  Users, Wheat, Tractor, PawPrint, Milk, Egg,
  BarChart3, Shield, Clock, TrendingUp, Check,
} from 'lucide-react';
import dashboardImage from '../../../inspiration_images/dashboard.png';
import betweenImage from '../../../inspiration_images/between.png';

const navLinks = [
  { to: '#home', label: 'Home', icon: Home },
  { to: '#about', label: 'About Us', icon: null },
  { to: '#features', label: 'Features', icon: null },
  { to: '#contact', label: 'Contact', icon: null },
];

const features = [
  {
    icon: Users,
    title: 'Employee Management',
    desc: 'Track your farm workers, roles, salaries, and contact information all in one place.',
  },
  {
    icon: Wheat,
    title: 'Crop Management',
    desc: 'Monitor planted crops, track expenses, record sales, and manage field operations.',
  },
  {
    icon: PawPrint,
    title: 'Livestock Tracking',
    desc: 'Keep detailed records of your animals and track their production data over time.',
  },
  {
    icon: Tractor,
    title: 'Machinery Management',
    desc: 'Log equipment purchases, schedule maintenance, and track activity costs.',
  },
  {
    icon: Milk,
    title: 'Milk Production',
    desc: 'Daily milk tracking with morning, midday, and evening production & consumption logs.',
  },
  {
    icon: Egg,
    title: 'Egg Production',
    desc: 'Track egg collection across your poultry with feeds and daily analytics.',
  },
];

const benefits = [
  {
    icon: Clock,
    title: 'Save Time',
    desc: 'Automate record-keeping and reduce manual data entry with our intuitive interface.',
  },
  {
    icon: BarChart3,
    title: 'Data-Driven Decisions',
    desc: 'Visual analytics and charts help you understand trends and optimize operations.',
  },
  {
    icon: Shield,
    title: 'Secure & Reliable',
    desc: 'Your farm data is securely stored and accessible only to authorized users.',
  },
  {
    icon: TrendingUp,
    title: 'Scale Easily',
    desc: 'Whether you manage one farm or multiple operations, our system grows with you.',
  },
];

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-brand-white">
      {/* ─── Navbar ─────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-brand-dark rounded-lg flex items-center justify-center">
                <Sprout size={18} className="text-brand-teal" />
              </div>
              <span className="text-xl font-bold text-brand-dark">FarmFlow</span>
            </Link>

            {/* Desktop Nav - Pill Container */}
            <div className="hidden md:flex items-center bg-brand-dark rounded-full px-2 py-1.5">
              {navLinks.map((link, i) => (
                <button
                  key={link.label}
                  onClick={() => scrollTo(link.to)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    i === 0
                      ? 'bg-white text-brand-dark'
                      : 'text-white hover:text-brand-teal-light'
                  }`}
                >
                  {link.icon && <link.icon size={14} />}
                  {link.label}
                </button>
              ))}
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                to="/login"
                className="px-4 py-2 rounded-full border border-brand-dark text-sm font-medium text-brand-dark hover:bg-brand-dark hover:text-white transition-colors"
              >
                Sign In
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4">
            {navLinks.map(link => (
              <button
                key={link.label}
                onClick={() => scrollTo(link.to)}
                className="block w-full text-left px-4 py-3 rounded-lg text-brand-dark hover:bg-gray-50"
              >
                {link.label}
              </button>
            ))}
            <div className="border-t border-gray-100 mt-3 pt-3 flex flex-col gap-2">
              <Link to="/login" className="px-4 py-3 text-center rounded-lg hover:bg-gray-50">Sign In</Link>
            </div>
          </div>
        )}
      </nav>

      {/* ─── Hero Section ───────────────────────── */}
      <section id="home" className="pt-10 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-brand-dark leading-tight">
              Complete Farm Management <span className="text-brand-teal">Software</span>
            </h1>
            <p className="mt-6 text-lg text-gray-600 leading-relaxed max-w-xl">
              Streamline your farming operations from crops to livestock. Track expenses, manage employees, 
              monitor production, and make data-driven decisions — all in one powerful platform.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/register"
                className="px-8 py-4 rounded-full bg-brand-teal text-white font-semibold hover:bg-brand-teal-dark transition-colors shadow-lg shadow-brand-teal/25"
              >
                Get Started Free
              </Link>
              <button
                onClick={() => scrollTo('#features')}
                className="px-8 py-4 rounded-full border border-gray-300 text-brand-dark font-semibold hover:border-brand-dark transition-colors"
              >
                Learn More
              </button>
            </div>
            {/* Trust badges */}
            <div className="mt-12 flex items-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Check size={16} className="text-brand-teal" />
                <span>Free to start</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={16} className="text-brand-teal" />
                <span>No credit card</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={16} className="text-brand-teal" />
                <span>Easy setup</span>
              </div>
            </div>
          </div>

          {/* Hero Image / Illustration */}
          <div className="relative">
            <div className="bg-gradient-to-br from-brand-teal/10 to-brand-teal/5 rounded-3xl p-8 lg:p-12">
              <img
                src="/inspiration_images/main.png"
                alt="Farm Management Dashboard"
                className="w-full rounded-2xl shadow-2xl"
                onError={(e) => {
                  // Fallback if image doesn't load
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              {/* Fallback illustration */}
              <div className="aspect-video bg-white rounded-2xl shadow-2xl overflow-hidden">
                <img
                  src={dashboardImage}
                  alt="Dashboard Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            {/* Floating stats */}
            <div className="absolute -left-4 top-1/4 bg-white rounded-2xl shadow-xl p-4 hidden lg:block">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <TrendingUp size={20} className="text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Production</p>
                  <p className="text-lg font-bold text-brand-dark">+24%</p>
                </div>
              </div>
            </div>
            <div className="absolute -right-4 bottom-1/4 bg-white rounded-2xl shadow-xl p-4 hidden lg:block">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-teal/10 rounded-xl flex items-center justify-center">
                  <Users size={20} className="text-brand-teal" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Employees</p>
                  <p className="text-lg font-bold text-brand-dark">12 Active</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── About Section ──────────────────────── */}
      <section id="about" className="py-20 bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-brand-dark">
            One Platform, <span className="text-brand-teal">Multiple Possibilities</span>
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Whether you're managing crops, livestock, machinery, or a full-scale farming operation, 
            our platform adapts to your needs — enabling smarter decisions through one centralized system.
          </p>
        </div>
      </section>

      {/* ─── Between Image Section ─────────────── */}
      <section className="bg-gray-50 px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-3xl overflow-hidden shadow-xl">
            <img
              src={betweenImage}
              alt="Farm management overview"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </section>

      {/* ─── Features Section ───────────────────── */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-brand-dark">
              Everything You Need to <span className="text-brand-teal">Manage Your Farm</span>
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive modules designed to cover every aspect of modern farm management.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map(f => (
              <div
                key={f.title}
                className="bg-white rounded-2xl p-8 border border-gray-100 hover:border-brand-teal/30 hover:shadow-xl hover:shadow-brand-teal/5 transition-all group"
              >
                <div className="w-14 h-14 bg-brand-teal/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-brand-teal/20 transition-colors">
                  <f.icon size={28} className="text-brand-teal" />
                </div>
                <h3 className="text-xl font-bold text-brand-dark mb-3">{f.title}</h3>
                <p className="text-gray-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Benefits Section ───────────────────── */}
      <section className="py-20 bg-brand-dark px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Benefits of Using <span className="text-brand-teal">FarmFlow</span>
            </h2>
            <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
              Our platform simplifies farm operations and helps you make smarter decisions.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map(b => (
              <div key={b.title} className="text-center">
                <div className="w-16 h-16 mx-auto bg-brand-teal/20 rounded-2xl flex items-center justify-center mb-6">
                  <b.icon size={32} className="text-brand-teal" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{b.title}</h3>
                <p className="text-gray-400 leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA Section ────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-brand-dark">
            Ready to Transform Your Farm Management?
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Join farmers who are already using FarmFlow to streamline operations, 
            track production, and boost profitability.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/register"
              className="px-8 py-4 rounded-full bg-brand-teal text-white font-semibold hover:bg-brand-teal-dark transition-colors shadow-lg shadow-brand-teal/25"
            >
              Get Started Free
            </Link>
            <Link
              to="/login"
              className="px-8 py-4 rounded-full border border-gray-300 text-brand-dark font-semibold hover:border-brand-dark transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Contact / Footer ───────────────────── */}
      <footer id="contact" className="bg-gray-50 border-t border-gray-100 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12">
            {/* Brand */}
            <div className="md:col-span-2">
              <Link to="/" className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-brand-dark rounded-lg flex items-center justify-center">
                  <Sprout size={18} className="text-brand-teal" />
                </div>
                <span className="text-xl font-bold text-brand-dark">FarmFlow</span>
              </Link>
              <p className="text-gray-600 max-w-md">
                Complete farm management software to streamline your operations 
                from crops to livestock, all in one powerful platform.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-brand-dark mb-4">Quick Links</h4>
              <ul className="space-y-3 text-gray-600">
                <li><button onClick={() => scrollTo('#home')} className="hover:text-brand-teal transition-colors">Home</button></li>
                <li><button onClick={() => scrollTo('#about')} className="hover:text-brand-teal transition-colors">About Us</button></li>
                <li><button onClick={() => scrollTo('#features')} className="hover:text-brand-teal transition-colors">Features</button></li>
                <li><Link to="/login" className="hover:text-brand-teal transition-colors">Sign In</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold text-brand-dark mb-4">Contact</h4>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center gap-2">
                  <Mail size={16} className="text-brand-teal" />
                  <span>support@farmflow.com</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 mt-12 pt-8 text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} FarmFlow. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
