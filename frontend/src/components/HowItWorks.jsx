import { useEffect, useRef } from "react";
import "./HowItWorks.css";

const steps = [
  {
    number: "01",
    title: "Create your account",
    description: "Sign up for free and join the student community in seconds.",
  },
  {
    number: "02",
    title: "Upload resources",
    description: "Share notes, past papers, and solutions with classmates.",
  },
  {
    number: "03",
    title: "Discover and learn",
    description: "Browse curated materials from students across your courses.",
  },
  {
    number: "04",
    title: "Ace every exam",
    description: "Use the right resources to study smarter and feel confident.",
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
      { threshold: 0.2 },
    );

    const stepEls = sectionRef.current?.querySelectorAll(".hiw__step");
    stepEls?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section id="how-it-works" className="hiw" ref={sectionRef}>
      <div className="container">
        <div className="hiw__header">
          <span className="neo-tag">How It Works</span>
          <h2 className="hiw__title">Get started in four bold steps</h2>
          <p className="hiw__subtitle">
            From sign-up to exam day, the workflow is clear and fast.
          </p>
        </div>

        <div className="hiw__steps">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className="hiw__step"
              style={{ "--delay": `${index * 0.12}s` }}
            >
              <div className="hiw__step-number">{step.number}</div>
              <h3 className="hiw__step-title">{step.title}</h3>
              <p className="hiw__step-desc">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
