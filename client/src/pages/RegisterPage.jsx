import { useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { API_URL } from "../config";

function RegisterPage() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "participant",
    language: "English",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(formData.email.trim())) {
      alert(t("validEmailMessage"));
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/api/auth/register`,
        {
          ...formData,
          email: formData.email.trim().toLowerCase(),
        }
      );

      alert(response.data.message);

      setFormData({
        name: "",
        email: "",
        phone: "",
        password: "",
        role: "participant",
        language: "English",
      });
    } catch (error) {
      console.error("Registration Error:", error);

      if (error.response) {
        alert(error.response.data.message);
      } else {
        alert(error.message);
      }
    }
  };
return (
  <div className="register-page">

    <div className="overlay"></div>

    <div className="login-container">

      <div className="login-card">

        <h1 className="login-logo">
          EVENTORA
        </h1>

        <h2 className="login-welcome">
          Create Account 🚀
        </h2>

        <p className="login-tagline">
          Join the Eventora Community
        </p>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="login-input"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="login-input"
            required
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            className="login-input"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="login-input"
            required
          />

          <div className="register-row">

  <select
    name="role"
    value={formData.role}
    onChange={handleChange}
    className="login-input"
  >
    <option value="participant">Participant</option>
    <option value="organizer">Organizer</option>
  </select>

  <select
    name="language"
    value={formData.language}
    onChange={handleChange}
    className="login-input"
  >
    <option value="English">English</option>
    <option value="Kannada">Kannada</option>
    <option value="Telugu">Telugu</option>
    <option value="Hindi">Hindi</option>
    <option value="Tamil">Tamil</option>
  </select>

</div>

          <button
            type="submit"
            className="register-submit"
          >
            Register
          </button>

          

        </form>
        <div className="auth-link">
  Already have an account?
  <a href="/login"> Login</a>
</div>
      </div>

    </div>

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

export default RegisterPage;
