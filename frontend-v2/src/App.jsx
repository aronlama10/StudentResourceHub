import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Auth from "./pages/Auth";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import DashboardHome from "./pages/dashboard/DashboardHome";
import Upload from "./pages/dashboard/Upload";
import MyResources from "./pages/dashboard/MyResources";
import Profile from "./pages/dashboard/Profile";
import "./App.css";
import Resources from "./pages/dashboard/Resources";

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="resources" element={<Resources />} />
            <Route path="upload" element={<Upload />} />
            <Route path="my-resources" element={<MyResources />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
