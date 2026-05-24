import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Header.css";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Community", href: "#invitation" },
  ];

  return (
    <header className={`header${scrolled ? " header--scrolled" : ""}`}>
      <div className="header__inner container">
        <a
          href="#hero"
          className="header__logo"
          aria-label="Student Resource Hub home"
        >
          <span className="header__logo-icon">SR</span>
          <span className="header__logo-text">StudentHub</span>
        </a>

        <nav className="header__nav">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="header__nav-link">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="header__actions">
          <Link to="/auth" className="header__btn header__btn--ghost">
            Log In
          </Link>
          <Link to="/auth" className="header__btn header__btn--primary">
            Sign Up Free
          </Link>
        </div>

        <button
          className={`header__burger${menuOpen ? " header__burger--active" : ""}`}
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Toggle navigation menu"
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <div
        className={`header__mobile${menuOpen ? " header__mobile--open" : ""}`}
      >
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
            <Link
              to="/auth"
              className="header__btn header__btn--ghost"
              onClick={() => setMenuOpen(false)}
            >
              Log In
            </Link>
            <Link
              to="/auth"
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
