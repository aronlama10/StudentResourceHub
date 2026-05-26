import { useEffect, useRef } from "react";
import "../css/HowItWorks.css";

const steps = [
  {
    number: "01",
    title: "Create Your Account",
    description:
      "Sign up for free with your email. It takes less than 30 seconds to get started and join the community.",
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Upload Resources",
    description:
      "Share your notes, past questions, solution papers, and PDF documents. Help others while building your own library.",
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Discover & Learn",
    description:
      "Browse resources uploaded by fellow students. Find exactly what you need for your courses and exams.",
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
  },
  {
    number: "04",
    title: "Ace Your Exams",
    description:
      "With the right resources at your fingertips, prepare effectively and walk into every exam with confidence.",
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
];

export default function HowItWorks() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("hiw__step--visible");
          }
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -30px 0px" },
    );

    const stepEls = sectionRef.current?.querySelectorAll(".hiw__step");
    stepEls?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section id="how-it-works" className="hiw" ref={sectionRef}>
      <div className="container">
        {/* Section Header */}
        <div className="hiw__header">
          <span className="section-tag">How It Works</span>
          <h2 className="hiw__title">
            Get started in <span className="gradient-text">4 simple steps</span>
          </h2>
          <p className="hiw__subtitle">
            From sign-up to exam-ready — here's how Student Resource Hub works
            for you.
          </p>
        </div>

        {/* Steps */}
        <div className="hiw__steps" id="hiw-steps">
          {steps.map((step, index) => (
            <div
              key={index}
              className="hiw__step"
              style={{ "--delay": `${index * 0.15}s` }}
              id={`hiw-step-${index}`}
            >
              {/* Connector Line */}
              {index < steps.length - 1 && <div className="hiw__connector" />}

              <div className="hiw__step-number">
                <span className="hiw__step-num-text">{step.number}</span>
                <div className="hiw__step-num-ring" />
              </div>

              <div className="hiw__step-content">
                <div className="hiw__step-icon">{step.icon}</div>
                <h3 className="hiw__step-title">{step.title}</h3>
                <p className="hiw__step-desc">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
