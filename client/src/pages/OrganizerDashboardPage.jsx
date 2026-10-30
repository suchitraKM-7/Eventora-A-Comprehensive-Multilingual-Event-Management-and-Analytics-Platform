import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { API_URL, getStoredUser } from "../config";
import useUserLanguage from "../hooks/useUserLanguage";
import { getUserLanguageKey } from "../config";

function OrganizerDashboardPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const user = getStoredUser();
  const userId = user?.id;
  const languages = [
  { code: "en", label: "English" },
  { code: "hi", label: "Hindi" },
  { code: "te", label: "Telugu" },
  { code: "kn", label: "Kannada" },
  { code: "ta", label: "Tamil" },
];
  const userRole = user?.role;
  const [analytics, setAnalytics] = useState(null);
  const [recentEvents, setRecentEvents] = useState([]);
  useUserLanguage();
  const handleLanguageChange = (event) => {
  const language = event.target.value;

  i18n.changeLanguage(language);

  localStorage.setItem(
    getUserLanguageKey(userId),
    language
  );
};
const handleLogout = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("selectedLanguage");

  i18n.changeLanguage("en");

  navigate("/");
};
  useEffect(() => {
    if (!userId || userRole !== "organizer") {
      navigate("/login");
      return;
    }

    const fetchAnalytics = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/analytics/organizer/${userId}`
        );

        setAnalytics(response.data);
        const eventsResponse = await axios.get(
  `${API_URL}/api/events`
);

const latestEvents = eventsResponse.data
  .filter(
    (event) =>
      event.organizerId === userId ||
      event.organizer === userId ||
      event.createdBy === userId
  )
  .sort(
    (a, b) =>
      new Date(b.createdAt) - new Date(a.createdAt)
  )
  .slice(0, 3);

setRecentEvents(latestEvents);
      } catch (error) {
        console.log(error);
      }
    };

    fetchAnalytics();
  }, [navigate, userId, userRole]);
  if (!user || user.role !== "organizer") {
    return null;
  }
  return (
    <main className="organizer-dashboard">
      <section className="organizer-container">
        {/* Hero Section */}
        <div className="hero-card">      
              <div className="organizer-hero">
            <div className="hero-content">
              <p className="organizer-portal-text">
  {t("eventOrganizerPortal")}
</p>

              <h1>
                {t("welcomeBack")}, {user?.name}
            </h1>

              <p className="organizer-description">
                {t("organizerDashboardDescription")}
              </p>
              <div className="language-card" style={{ marginTop: "20px" }}>
  {languages.map((language) => (
    <button
      key={language.code}
      onClick={() =>
        handleLanguageChange({
          target: { value: language.code },
        })
      }
      className={`language-btn ${
        i18n.language === language.code ? "active" : ""
      }`}
    >
      {language.label}
    </button>
  ))}
</div>
<button
  className="logout-btn"
  onClick={handleLogout}
>
  {t("logout")}
</button>
            </div>
          </div>
          
        </div>

        {/* Quick Actions */}
        <section className="mt-8">
          <h2
  style={{
    color: "white",
    marginBottom: "20px",
    fontSize: "26px",
  }}
>
            {t("quickActions")}
          </h2>

          <div className="quick-actions-grid">

  <div className="action-card">

  <div className="action-icon purple">
    🎉
  </div>

  <h3>{t("createEvent")}</h3>

  <p>{t("createEventDescription")}</p>
    <button onClick={() => navigate("/create-event")}>
      {t("open")} →
    </button>
  </div>

  <div className="action-card">
    <div className="action-icon pink">
  📅
</div>

<h3>{t("myEvents")}</h3>
    <p>{t("myEventsDescription")}</p>
    <button onClick={() => navigate("/my-events")}>
      {t("open")} →
    </button>
  </div>

  <div className="action-card">
    <div className="action-icon cyan">
  🎫
</div>

<h3>{t("verifyTicket")}</h3>
    <p>{t("verifyTicketDescription")}</p>
    <button onClick={() => navigate("/verify-ticket")}>
      {t("open")} →
    </button>
  </div>

  <div className="action-card">
    <div className="action-icon gold">
  📊
</div>

<h3>{t("analytics")}</h3>
    <p>{t("analyticsDescription")}</p>
    <button onClick={() => navigate("/analytics")}>
      {t("open")} →
    </button>
  </div>

</div>
        </section>

        {/* {t("keyStatistics")} */}
<section className="mt-8">
  <h2
  style={{
    color: "white",
    marginBottom: "20px",
fontSize: "26px"  }}
>
    {t("keyStatistics")}
  </h2>

        <div className="stats-grid">

  <div className="stat-card">

  <div className="stat-icon purple">
    📅
  </div>

  <div>
    <h4>{t("totalEvents")}</h4>
    <h2>{analytics?.totalEvents || 0}</h2>
  </div>

</div>

 <div className="stat-card">
  <div className="stat-icon pink">👥</div>

  <div>
    <h4>{t("totalBookings")}</h4>
    <h2>{analytics?.totalBookings || 0}</h2>
  </div>
</div>

 <div className="stat-card">
  <div className="stat-icon green">₹</div>

  <div>
    <h4>{t("totalRevenue")}</h4>
    <h2>
      ₹{analytics?.totalRevenue || analytics?.netRevenue || 0}
    </h2>
  </div>
</div>

 <div className="stat-card">
  <div className="stat-icon gold">⭐</div>

  <div>
    <h4>{t("averageRating")}</h4>
    <h2>{analytics?.averageRating || 0}</h2>
  </div>
</div>

</div>
        </section>
        {/* {t("recentEvents")} */}
        <div className="dashboard-row">

  {/* Recent Events */}
  <div className="recent-events-card">
    <h2
      style={{
        color: "white",
        marginBottom: "20px",
    fontSize: "26px"      }}
    >
      {t("recentEvents")}
    </h2>

    {recentEvents.length === 0 ? (
      <p>{t("noEventsFound")}</p>
    ) : (
      recentEvents.map((event) => (
        <div className="event-item">

  <div className="event-thumbnail">
    <img
      src={
        event.image ||
        "https://via.placeholder.com/120x80"
      }
      alt={event.eventName || t("event")}
    />
  </div>

  <div>
    <h4>
      {event.title ||
        event.name ||
        event.eventName}
    </h4>

            <p>
              📅 {event.date
                ? new Date(event.date).toLocaleDateString()
                : t("noDate")}
            </p>
            <span className="event-status">
  {t("upcoming")}
</span>
          </div>
        </div>
      ))
    )}
  </div>

  {/* Analytics Overview */}
  <div className="analytics-overview-card">
    <h2
      style={{
        color: "white",
        marginBottom: "20px",
    fontSize: "26px"      }}
    >
      {t("analyticsOverview")}
    </h2>

    <p>
      {t("analyticsOverviewDescription")}
    </p>
    
    <button
      onClick={() => navigate("/analytics")}
      className="analytics-btn"
    >
      {t("viewFullAnalytics")} →
    </button>
    </div>

</div>
      </section>
    </main>
  );
}

export default OrganizerDashboardPage;
