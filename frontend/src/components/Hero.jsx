import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./Hero.css";

export default function Hero() {
  const heroRef = useRef(null);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const handleMouseMove = (event) => {
      const rect = hero.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      hero.style.setProperty("--mouse-x", `${x}%`);
      hero.style.setProperty("--mouse-y", `${y}%`);
    };

    hero.addEventListener("mousemove", handleMouseMove);
    return () => hero.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section id="hero" className="hero" ref={heroRef}>
      <div className="hero__bg" aria-hidden="true">
        <div className="hero__burst hero__burst--sun" />
        <div className="hero__burst hero__burst--sky" />
        <div className="hero__grid" />
      </div>

      <div className="hero__content container">
        <span className="hero__badge">Open for all students - 100% free</span>
        <h1 className="hero__title">
          Share knowledge,
          <br />
          succeed together.
        </h1>
        <p className="hero__subtitle">
          A student-first hub to upload notes, past questions, solution papers,
          and PDFs. Everything organized, searchable, and built for the campus
          community.
        </p>

        <div className="hero__cta">
          <Link to="/auth" className="hero__btn hero__btn--primary">
            Get started for free
          </Link>
          <a href="#how-it-works" className="hero__btn hero__btn--outline">
            See how it works
          </a>
        </div>

        <div className="hero__stats">
          <div className="hero__stat">
            <span className="hero__stat-value">500+</span>
            <span className="hero__stat-label">Resources shared</span>
          </div>
          <div className="hero__stat">
            <span className="hero__stat-value">200+</span>
            <span className="hero__stat-label">Active students</span>
          </div>
          <div className="hero__stat">
            <span className="hero__stat-value">50+</span>
            <span className="hero__stat-label">Courses covered</span>
          </div>
        </div>
      </div>

      <div className="hero__floating" aria-hidden="true">
        <div className="hero__float-card hero__float-card--1">
          📝Notes uploaded
        </div>
        <div className="hero__float-card hero__float-card--2">📋PDF shared</div>
        <div className="hero__float-card hero__float-card--3">
          ✅Solutions added
        </div>
      </div>
    </section>
  );
}
