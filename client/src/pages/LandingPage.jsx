import { Link } from "react-router-dom";
import "./LandingPage.css";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../components/ui/LanguageSwitcher";
import { useEffect } from "react";
function LandingPage() {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    localStorage.setItem("language", "en");
    i18n.changeLanguage("en");
  }, []);

  return (
   <div className="landing-page">

      {/* Overlay */}
      <div className="overlay"></div>

      {/* Top Navbar */}
      <div className="navbar">

        <div className="language-box">
  <LanguageSwitcher compact />
</div>

        <div className="nav-buttons">
          <Link to="/login">
            <button className="login-btn">
              {t("login")}
            </button>
          </Link>

          <Link to="/register">
            <button className="register-btn">
              {t("register")}
            </button>
          </Link>
        </div>
      </div>

      {/* Hero Content */}
      <div className="landing-hero-content">

               <h1> EVENTORA</h1>

  <h2>Manage Events. Measure Success.</h2>

  <p>
    A Comprehensive Multilingual Event Management and Analytics Platform.
  </p>

        

      </div>

      {/* Bottom Features */}
      <div className="features">

        <div className="feature">
          <h3>Create Events</h3>
          <p>
            Organizers can create and manage events.
          </p>
        </div>

        <div className="feature">
          <h3>Book Tickets</h3>
          <p>
            Easy ticket booking experience.
          </p>
        </div>

        <div className="feature">
          <h3>Manage Attendance</h3>
          <p>
            QR based attendance tracking.
          </p>
        </div>

        <div className="feature">
          <h3>Analytics & Feedback</h3>
          <p>
            Insights and feedback reports.
          </p>
        </div>

      </div>

    </div>
  );
}

export default LandingPage;