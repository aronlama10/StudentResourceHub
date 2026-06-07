import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "../css/Hero.css";

export default function Hero() {
  const heroRef = useRef(null);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const handleMouseMove = (e) => {
      const rect = hero.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      hero.style.setProperty("--mouse-x", `${x}%`);
      hero.style.setProperty("--mouse-y", `${y}%`);
    };

    hero.addEventListener("mousemove", handleMouseMove);
    return () => hero.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section id="hero" className="hero" ref={heroRef}>
      {/* Animated Background Elements */}
      <div className="hero__bg">
        <div className="hero__orb hero__orb--1" />
        <div className="hero__orb hero__orb--2" />
        <div className="hero__orb hero__orb--3" />
        <div className="hero__grid" />
        <div className="hero__glow" />
      </div>

      <div className="hero__content container">
        {/* Badge */}
        <div className="hero__badge" id="hero-badge">
          <span className="hero__badge-dot" />
          <span>Open for all students — 100% Free</span>
        </div>

        {/* Heading */}
        <h1 className="hero__title" id="hero-title">
          Share Knowledge,
          <br />
          <span className="gradient-text">Succeed Together</span>
        </h1>

        {/* Subheading */}
        <p className="hero__subtitle" id="hero-subtitle">
          Your one-stop platform to discover, share, and access academic
          resources — notes, past questions, solution papers, and PDFs — all
          organized and contributed by students, for students.
        </p>

        {/* CTA Buttons */}
        <div className="hero__cta" id="hero-cta">
          <Link to="/signup" className="hero__btn hero__btn--primary">
            Get Started — It's Free
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
          <a href="#how-it-works" className="hero__btn hero__btn--outline">
            See How It Works
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </a>
        </div>

        {/* Stats Strip */}
        <div className="hero__stats" id="hero-stats">
          <div className="hero__stat">
            <span className="hero__stat-value gradient-text">500+</span>
            <span className="hero__stat-label">Resources Shared</span>
          </div>
          <div className="hero__stat-divider" />
          <div className="hero__stat">
            <span className="hero__stat-value gradient-text">200+</span>
            <span className="hero__stat-label">Active Students</span>
          </div>
          <div className="hero__stat-divider" />
          <div className="hero__stat">
            <span className="hero__stat-value gradient-text">50+</span>
            <span className="hero__stat-label">Courses Covered</span>
          </div>
        </div>
      </div>

      {/* Floating Cards */}
      <div className="hero__floating" aria-hidden="true">
        <div className="hero__float-card hero__float-card--1">
          <div className="hero__float-icon">📝</div>
          <span>Notes Uploaded</span>
        </div>
        <div className="hero__float-card hero__float-card--2">
          <div className="hero__float-icon">📄</div>
          <span>PDF Shared</span>
        </div>
        <div className="hero__float-card hero__float-card--3">
          <div className="hero__float-icon">✅</div>
          <span>Solution Added</span>
        </div>
      </div>
    </section>
  );
}
