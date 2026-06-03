import { useEffect, useRef } from 'react';
import '../css/Invitation.css';

export default function Invitation() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('invitation--visible');
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="invitation" className="invitation" ref={sectionRef}>
      <div className="container">
        <div className="invitation__card">
          {/* Background decorations */}
          <div className="invitation__bg">
            <div className="invitation__orb invitation__orb--1" />
            <div className="invitation__orb invitation__orb--2" />
            <div className="invitation__pattern" />
          </div>

          <div className="invitation__content">
            <span className="section-tag" style={{ background: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.15)', color: '#fff' }}>
              Join the Community
            </span>
            <h2 className="invitation__title">
              Ready to level up your
              <br />
              <span className="invitation__title-accent">academic game?</span>
            </h2>
            <p className="invitation__subtitle">
              Join hundreds of students who are already sharing and discovering resources. 
              Create your free account today and start contributing to a growing knowledge base.
            </p>

            <div className="invitation__cta">
              <a href="#" className="invitation__btn invitation__btn--primary" id="cta-signup">
                Create Free Account
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
              <a href="#" className="invitation__btn invitation__btn--ghost" id="cta-login">
                Already have an account? Log In
              </a>
            </div>

            {/* Trust indicators */}
            <div className="invitation__trust">
              <div className="invitation__trust-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>100% Free to use</span>
              </div>
              <div className="invitation__trust-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>No credit card required</span>
              </div>
              <div className="invitation__trust-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Start sharing in seconds</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
