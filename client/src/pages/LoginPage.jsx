import { useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  API_URL,
  getUserLanguageKey,
  supportedLanguages,
} from "../config";


function LoginPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${API_URL}/api/auth/login`,
        formData
      );

      alert(response.data.message);

      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      const selectedLanguage =
  localStorage.getItem("selectedLanguage") ||
  "en";

i18n.changeLanguage(selectedLanguage);
      if (response.data.user.role === "admin") {
        navigate("/admin-dashboard");
      } else if (
        response.data.user.role ===
        "organizer"
      ) {
        navigate("/organizer-dashboard");
      } else {
        navigate("/participant-dashboard");
      }

    } catch (error) {
      alert(
        error.response?.data?.message ||
        t("loginFailed")
      );
    }
  };

 return (
  <div className="login-page">

    <div className="overlay"></div>

    <div className="login-container">

      <div className="login-card">

        <h1 className="login-logo">
          EVENTORA
        </h1>

        <h2 className="login-welcome">
          Welcome Back 👋
        </h2>

        <p className="login-tagline">
          Manage Events. Measure Success.
        </p>

        <form onSubmit={handleSubmit}>

          <input
            type="email"
            name="email"
            placeholder={t("email")}
            value={formData.email}
            onChange={handleChange}
            className="login-input"
            required
          />

          <input
            type="password"
            name="password"
            placeholder={t("password")}
            value={formData.password}
            onChange={handleChange}
            className="login-input"
            required
          />

          <div className="forgot-password">
            Forgot Password?
          </div>

          <button
            type="submit"
            className="login-submit"
          >
            {t("login")}
          </button>

        </form>

        <p className="register-text">
          Don't have an account?

          <span
            className="register-link"
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </p>

      </div>

    </div>

    <div className="features">

      <div className="feature">
        <h3>Create Events</h3>
        <p>Organizers can create and manage events.</p>
      </div>

      <div className="feature">
        <h3>Book Tickets</h3>
        <p>Easy ticket booking experience.</p>
      </div>

      <div className="feature">
        <h3>Manage Attendance</h3>
        <p>QR based attendance tracking.</p>
      </div>

      <div className="feature">
        <h3>Analytics & Feedback</h3>
        <p>Insights and feedback reports.</p>
      </div>

    </div>

  </div>
);
}

export default LoginPage;
