import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./Invitation.css";

export default function Invitation() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("invitation--visible");
          }
        });
      },
      { threshold: 0.2 },
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="invitation" className="invitation" ref={sectionRef}>
      <div className="container">
        <div className="invitation__card">
          <div className="invitation__content">
            <span className="neo-tag invitation__tag">Join the community</span>
            <h2 className="invitation__title">
              Ready to level up your
              <br />
              academic game?
            </h2>
            <p className="invitation__subtitle">
              Join hundreds of students already sharing and discovering
              resources. Create your free account and start contributing today.
            </p>

            <div className="invitation__cta">
              <Link
                to="/auth"
                className="neo-btn invitation__btn invitation__btn--primary"
              >
                Create free account
              </Link>
              <Link
                to="/auth"
                className="invitation__btn invitation__btn--ghost"
              >
                Already have an account? Log in
              </Link>
            </div>

            <div className="invitation__trust">
              <span>100% free to use</span>
              <span>No credit card required</span>
              <span>Start sharing in seconds</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
