import AuthModal from "../components/landing/AuthModal";
import Features from "../components/landing/Features";
import Footer from "../components/landing/Footer";
import Faq from "../components/landing/Faq";
import Header from "../components/landing/Header";
import Hero from "../components/landing/Hero";
import HowItWorks from "../components/landing/HowItWorks";

function LandingPage({
  authMode,
  isAuthOpen,
  onAuthClose,
  onAuthModeChange,
  onAuthOpen,
}) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--page-bg)] text-[var(--ink)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_top,rgba(255,227,110,0.35),transparent_62%)]" />
      <div className="pointer-events-none absolute right-[-7rem] top-20 h-52 w-52 rounded-[2rem] border-[8px] border-[rgba(17,17,17,0.14)] bg-[rgba(185,221,255,0.22)]" />

      <Header onGetStarted={() => onAuthOpen("register")} />

      <main className="relative mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 pb-16 pt-8 sm:px-6 lg:px-8 lg:pt-12">
        <Hero
          onPrimaryAction={() => onAuthOpen("register")}
          onSecondaryAction={() => onAuthOpen("login")}
        />
        <Features />
        <HowItWorks />
        <Faq />
      </main>

      <Footer onGetStarted={() => onAuthOpen("register")} />

      <AuthModal
        authMode={authMode}
        isOpen={isAuthOpen}
        onClose={onAuthClose}
        onModeChange={onAuthModeChange}
      />
    </div>
  );
}

export default LandingPage;
