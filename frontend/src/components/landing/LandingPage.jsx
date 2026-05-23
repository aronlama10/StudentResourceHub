export { default } from "../../pages/LandingPage";import Features from "./Features";
import Faq from "./Faq";
import Footer from "./Footer";
import Header from "./Header";
import Hero from "./Hero";
import HowItWorks from "./HowItWorks";
import Resources from "./Resources";

function LandingPage({ onAuthOpen }) {
  return (
    <div className="min-h-screen bg-[#fef3c7] text-black">
      <Header onAuthOpen={onAuthOpen} />
      <main
        id="home"
        className="mx-auto w-full max-w-6xl px-4 pb-16 pt-12 sm:px-6 lg:px-8"
      >
        <Hero />
        <Features />
        <HowItWorks />
        <Resources />
        <Faq />
      </main>
      <Footer onAuthOpen={onAuthOpen} />
    </div>
  );
}

export default LandingPage;
