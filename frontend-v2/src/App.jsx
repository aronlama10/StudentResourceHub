import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import DashboardHome from "./pages/dashboard/DashboardHome";
import Upload from "./pages/dashboard/Upload";
import MyResources from "./pages/dashboard/MyResources";
import SavedResources from "./pages/dashboard/SavedResources";
import Profile from "./pages/dashboard/Profile";
import "./App.css";
import Resources from "./pages/dashboard/Resources";
import 'react-toastify/dist/ReactToastify.css';
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";
import { toast, ToastContainer } from "react-toastify";
import { ThemeProvider } from "./context/ThemeContext";
import ThemeToggle from "./components/ThemeToggle";
import { Analytics } from '@vercel/analytics/react';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="app">
          <ToastContainer
            position="top-right"
            closeOnClick
            autoClose={3000}
            theme="dark"
          />
          <Analytics />
          <ThemeToggle />
          <Routes>
            <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />

            <Route path="/dashboard" element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>
              <Route index element={<DashboardHome />} />
              <Route path="resources" element={<Resources />} />
              <Route path="my-resources" element={<MyResources />} />
              <Route path="saved-resources" element={<SavedResources />} />
              <Route path="upload" element={<Upload />} />
              <Route path="profile" element={<Profile />} />
            </Route>
          </Routes>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
