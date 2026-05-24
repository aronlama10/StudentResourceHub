import Header from "../components/Header";
import Hero from "../components/Hero";
import Features from "../components/Features";
import HowItWorks from "../components/HowItWorks";
import Invitation from "../components/Invitation";
import Footer from "../components/Footer";

function LandingPage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Invitation />
      </main>
      <Footer />
    </>
  );
}

export default LandingPage;
