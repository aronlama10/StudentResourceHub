import { useEffect, useRef } from "react";
import "./Features.css";

const features = [
  {
    title: "Share notes and PDFs",
    description:
      "Upload notes, study materials, and PDF documents to help classmates prep smarter.",
    accent: "var(--color-sun)",
  },
  {
    title: "Past question packs",
    description:
      "Find past exam questions organized by subject and year so you walk in prepared.",
    accent: "var(--color-sky)",
  },
  {
    title: "Solution papers",
    description:
      "Verify answers and deepen understanding with solutions contributed by top students.",
    accent: "var(--color-berry)",
  },
  {
    title: "Student community",
    description:
      "Browse resources from peers across courses and build knowledge together.",
    accent: "var(--color-mint)",
  },
  {
    title: "Personal dashboard",
    description:
      "Track uploads, manage shared resources, and stay organized in one place.",
    accent: "var(--color-orange)",
  },
  {
    title: "Secure by design",
    description:
      "Modern authentication keeps your account protected and sharing safe.",
    accent: "var(--color-sun)",
  },
];

export default function Features() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("features__card--visible");
          }
        });
      },
      { threshold: 0.15 },
    );

    const cards = sectionRef.current?.querySelectorAll(".features__card");
    cards?.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  return (
    <section id="features" className="features" ref={sectionRef}>
      <div className="container">
        <div className="features__header">
          <span className="neo-tag">Features</span>
          <h2 className="features__title">
            Everything you need to ace every semester
          </h2>
          <p className="features__subtitle">
            A bold, student-first toolkit for sharing, discovering, and
            organizing the materials that matter most.
          </p>
        </div>

        <div className="features__grid">
          {features.map((feature, index) => (
            <article
              key={feature.title}
              className="features__card"
              style={{
                "--accent": feature.accent,
                "--delay": `${index * 0.08}s`,
              }}
            >
              <div className="features__card-top" />
              <h3 className="features__card-title">{feature.title}</h3>
              <p className="features__card-desc">{feature.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
