import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../css/Header.css";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Community", href: "#invitation" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const sections = navLinks
      .map((link) => document.querySelector(link.href))
      .filter(Boolean);

    if (!sections.length) return;

    const updateActiveSection = () => {
      // At the top of the landing page, no section link is active.
      if (window.scrollY < 100) {
        setActiveSection("");
        return;
      }

      // Select the section closest to the header.
      const headerHeight =
        document.getElementById("site-header")?.offsetHeight || 80;

      const currentSection = sections
        .filter((section) => {
          const rect = section.getBoundingClientRect();
          return rect.top <= headerHeight + 100;
        })
        .sort(
          (a, b) =>
            b.getBoundingClientRect().top - a.getBoundingClientRect().top,
        )[0];

      setActiveSection(currentSection ? `#${currentSection.id}` : "");
    };

    window.addEventListener("scroll", updateActiveSection, {
      passive: true,
    });

    updateActiveSection();

    return () => {
      window.removeEventListener("scroll", updateActiveSection);
    };
  }, []);

  const handleNavClick = (href) => {
    setActiveSection(href);
    setMenuOpen(false);
  };

  return (
    <header
      id="site-header"
      className={`header${scrolled ? " header--scrolled" : ""}`}
    >
      <div className="header__inner container">
        {/* Logo */}
        <a
          href="#"
          className="header__logo"
          id="logo"
          onClick={() => setActiveSection("")}
        >
          <span className="header__logo-icon">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <defs>
                <linearGradient
                  id="logoGrad"
                  x1="0"
                  y1="0"
                  x2="32"
                  y2="32"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
              <rect
                x="2"
                y="4"
                width="28"
                height="24"
                rx="4"
                stroke="url(#logoGrad)"
                strokeWidth="2.5"
                fill="none"
              />
              <path
                d="M8 12h16M8 16h12M8 20h8"
                stroke="url(#logoGrad)"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle
                cx="26"
                cy="22"
                r="4"
                fill="url(#logoGrad)"
                opacity="0.7"
              />
            </svg>
          </span>

          <span className="header__logo-text">
            Student<span className="gradient-text">Hub</span>
          </span>
        </a>

        {/* Desktop Navigation */}
        <nav className="header__nav" id="main-nav">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`header__nav-link${
                activeSection === link.href ? " active" : ""
              }`}
              aria-current={
                activeSection === link.href ? "location" : undefined
              }
              onClick={() => handleNavClick(link.href)}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <div className="header__actions">
          <Link
            to="/login"
            className="header__btn header__btn--ghost"
            id="login-btn"
          >
            Log In
          </Link>

          <Link
            to="/signup"
            className="header__btn header__btn--primary"
            id="signup-btn"
          >
            Sign Up Free
            <span className="header__btn-shimmer" />
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className={`header__burger${
            menuOpen ? " header__burger--active" : ""
          }`}
          id="mobile-menu-toggle"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`header__mobile-menu${
          menuOpen ? " header__mobile-menu--open" : ""
        }`}
      >
        <nav className="header__mobile-nav">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`header__mobile-link${
                activeSection === link.href ? " active" : ""
              }`}
              aria-current={
                activeSection === link.href ? "location" : undefined
              }
              onClick={() => handleNavClick(link.href)}
            >
              {link.label}
            </a>
          ))}

          <div className="header__mobile-actions">
            <Link
              to="/login"
              className="header__btn header__btn--ghost"
              onClick={() => setMenuOpen(false)}
            >
              Log In
            </Link>

            <Link
              to="/signup"
              className="header__btn header__btn--primary"
              onClick={() => setMenuOpen(false)}
            >
              Sign Up Free
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
