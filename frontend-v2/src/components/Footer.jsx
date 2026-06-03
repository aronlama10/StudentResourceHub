import '../css/Footer.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    Product: [
      { label: 'Features', href: '#features' },
      { label: 'How It Works', href: '#how-it-works' },
      { label: 'Dashboard', href: '#' },
      { label: 'Resources', href: '#' },
    ],
    Community: [
      { label: 'Join Us', href: '#invitation' },
      { label: 'Student Stories', href: '#' },
      { label: 'Contribute', href: '#' },
      { label: 'Guidelines', href: '#' },
    ],
    Support: [
      { label: 'Help Center', href: '#' },
      { label: 'Contact Us', href: '#' },
      { label: 'Privacy Policy', href: '#' },
      { label: 'Terms of Service', href: '#' },
    ],
  };

  return (
    <footer id="site-footer" className="footer">
      <div className="container">
        <div className="footer__top">
          {/* Brand */}
          <div className="footer__brand">
            <a href="#" className="footer__logo">
              <span className="footer__logo-icon">
                <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                  <defs>
                    <linearGradient id="footerLogoGrad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                  </defs>
                  <rect x="2" y="4" width="28" height="24" rx="4" stroke="url(#footerLogoGrad)" strokeWidth="2.5" fill="none" />
                  <path d="M8 12h16M8 16h12M8 20h8" stroke="url(#footerLogoGrad)" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="26" cy="22" r="4" fill="url(#footerLogoGrad)" opacity="0.7" />
                </svg>
              </span>
              <span className="footer__logo-text">
                Student<span className="gradient-text">Hub</span>
              </span>
            </a>
            <p className="footer__brand-desc">
              Empowering students to share knowledge and resources. 
              Built by students, for students.
            </p>
          </div>

          {/* Links */}
          <div className="footer__links">
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category} className="footer__link-group">
                <h4 className="footer__link-title">{category}</h4>
                <ul className="footer__link-list">
                  {links.map((link) => (
                    <li key={link.label}>
                      <a href={link.href} className="footer__link">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="footer__divider" />

        {/* Bottom */}
        <div className="footer__bottom">
          <p className="footer__copyright">
            © {currentYear} Student Resource Hub. All rights reserved.
          </p>
          <p className="footer__made">
            Made with <span className="footer__heart">♥</span> for students everywhere
          </p>
        </div>
      </div>
    </footer>
  );
}
