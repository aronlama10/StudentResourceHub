import { useEffect, useRef } from 'react';
import '../css/Features.css';

const features = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
    title: 'Share Notes & PDFs',
    description:
      'Upload your lecture notes, study materials, and PDF documents to help fellow students prepare better and smarter.',
    accent: '#6366f1',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
    title: 'Past Questions',
    description:
      'Access a growing library of past exam questions organized by subject and year — so you never walk into an exam blind.',
    accent: '#06b6d4',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 11 12 14 22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
    title: 'Solution Papers',
    description:
      'Find detailed solutions and answer keys contributed by top students to verify your work and deepen understanding.',
    accent: '#8b5cf6',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: 'Student Community',
    description:
      'Join a vibrant community of learners — browse resources from other students across courses and build knowledge together.',
    accent: '#f43f5e',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <line x1="3" y1="9" x2="21" y2="9" />
        <line x1="9" y1="21" x2="9" y2="9" />
      </svg>
    ),
    title: 'Personal Dashboard',
    description:
      'Track your uploads, manage your shared resources, and browse everything from an intuitive and modern personal dashboard.',
    accent: '#22c55e',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
    title: 'Secure & Private',
    description:
      'Your account and data are protected with modern authentication. Share confidently with a safe, secure platform.',
    accent: '#f59e0b',
  },
];

export default function Features() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('features__card--visible');
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );

    const cards = sectionRef.current?.querySelectorAll('.features__card');
    cards?.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  return (
    <section id="features" className="features" ref={sectionRef}>
      <div className="container">
        {/* Section Header */}
        <div className="features__header">
          <span className="section-tag">Features</span>
          <h2 className="features__title">
            Everything you need to <span className="gradient-text">excel academically</span>
          </h2>
          <p className="features__subtitle">
            A comprehensive toolkit designed to streamline how students share, discover, 
            and access the study materials that matter most.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="features__grid" id="features-grid">
          {features.map((feature, index) => (
            <div
              key={index}
              className="features__card"
              style={{
                '--accent': feature.accent,
                '--delay': `${index * 0.1}s`,
              }}
              id={`feature-card-${index}`}
            >
              <div className="features__card-icon">
                {feature.icon}
              </div>
              <h3 className="features__card-title">{feature.title}</h3>
              <p className="features__card-desc">{feature.description}</p>
              <div className="features__card-glow" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
