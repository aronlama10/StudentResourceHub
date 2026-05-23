import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Community', href: '#invitation' },
  ];

  return (
    <header id="site-header" className={`header${scrolled ? ' header--scrolled' : ''}`}>
      <div className="header__inner container">
        {/* Logo */}
        <a href="#" className="header__logo" id="logo">
          <span className="header__logo-icon">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <defs>
                <linearGradient id="logoGrad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
              <rect x="2" y="4" width="28" height="24" rx="4" stroke="url(#logoGrad)" strokeWidth="2.5" fill="none" />
              <path d="M8 12h16M8 16h12M8 20h8" stroke="url(#logoGrad)" strokeWidth="2" strokeLinecap="round" />
              <circle cx="26" cy="22" r="4" fill="url(#logoGrad)" opacity="0.7" />
            </svg>
          </span>
          <span className="header__logo-text">
            Student<span className="gradient-text">Hub</span>
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className="header__nav" id="main-nav">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="header__nav-link">
              {link.label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <div className="header__actions">
          <Link to="/auth" className="header__btn header__btn--ghost" id="login-btn">
            Log In
          </Link>
          <Link to="/auth" className="header__btn header__btn--primary" id="signup-btn">
            Sign Up Free
            <span className="header__btn-shimmer" />
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className={`header__burger${menuOpen ? ' header__burger--active' : ''}`}
          id="mobile-menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`header__mobile-menu${menuOpen ? ' header__mobile-menu--open' : ''}`}>
        <nav className="header__mobile-nav">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="header__mobile-link"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <div className="header__mobile-actions">
            <Link to="/auth" className="header__btn header__btn--ghost" onClick={() => setMenuOpen(false)}>
              Log In
            </Link>
            <Link to="/auth" className="header__btn header__btn--primary" onClick={() => setMenuOpen(false)}>
              Sign Up Free
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
