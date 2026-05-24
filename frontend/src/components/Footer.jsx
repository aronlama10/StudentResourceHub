import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <p className="footer__title">Student Resource Hub</p>
          <p className="footer__desc">
            A bold landing page built for students who need fast access to
            shared knowledge.
          </p>
        </div>

        <div className="footer__links">
          <a href="#features">Features</a>
          <a href="#how-it-works">How it works</a>
          <a href="#invitation">Community</a>
          <Link to="/auth" className="footer__cta">
            Join free
          </Link>
        </div>
      </div>

      <div className="footer__bottom">
        <p>Copyright {currentYear} Student Resource Hub.</p>
        <p>Built for students everywhere.</p>
      </div>
    </footer>
  );
}
