import "./App.css";
import PrivateRoutes from "./components/PrivateRoutes"

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Auth from "./Auth";
import Home from "./home";
import Reg from "./Reg";
import OAuthCallback from "./OAuthCallback"
import ForgotPass from "./ForgotPass";
import Content from "./Content";
import Calendar from "./Calendar";
import Profile from "./Profile";
import OnboardingRez from "./OnboardingRez";
import SetProfile from "./SetProfile";
import Admin from "./AdminDash.tsx";
import Dashboard from "./Dashboard";
import Stats from "./Stats";
import Onboarding from "./Onboarding.tsx";
import AddContent from "./AddContent.tsx";
import EditContent from "./EditContent.tsx";
import Daily from "./Daily.tsx";


function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/auth/login" element={<Auth />} />
          <Route path="/auth/reg" element={<Reg />} />
          <Route path="auth/callback" element={<OAuthCallback />} />
          <Route path="/auth/onboarding" element={<Onboarding />} />
          <Route path="/auth/forgotpass" element={<ForgotPass />} />

          {/* Protected rute */}
          <Route element={<PrivateRoutes />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/content" element={<Content />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/setprofile" element={<SetProfile />} />
            <Route path="/profile/onboardingrez" element={<OnboardingRez />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="/addcontent" element={<AddContent />} />
            <Route path="/editcontent/:id" element={<EditContent />} />
            <Route path="/daily" element={<Daily />} />
          </Route>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
