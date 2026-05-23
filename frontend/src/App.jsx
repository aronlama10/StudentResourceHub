import { useState } from "react";
import LandingPage from "./pages/LandingPage";

function App() {
  const [isAuthOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("register");

  const openAuth = (mode = "register") => {
    setAuthMode(mode);
    setAuthOpen(true);
  };

  return (
    <LandingPage
      authMode={authMode}
      isAuthOpen={isAuthOpen}
      onAuthClose={() => setAuthOpen(false)}
      onAuthModeChange={setAuthMode}
      onAuthOpen={openAuth}
    />
  );
}

export default App;
