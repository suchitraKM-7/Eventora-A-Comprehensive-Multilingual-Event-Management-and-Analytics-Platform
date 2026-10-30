import { useEffect, useState } from "react";
import axios from "axios";
import "./AdminDashboard.css";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { API_URL, getStoredUser } from "../config";
import DashboardSection from "../components/dashboard/DashboardSection";
import StatCard from "../components/dashboard/StatCard";
import DataTable from "../components/ui/DataTable";
import useUserLanguage from "../hooks/useUserLanguage";

function AdminDashboardPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const user = getStoredUser();
  const userRole = user?.role;
  const [dashboard, setDashboard] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("users");
  useUserLanguage();

  useEffect(() => {
    if (userRole !== "admin") {
      navigate("/login");
      return;
    }

    const fetchDashboard = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/analytics/admin-dashboard`
        );

        setDashboard(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchDashboard();
  }, [navigate, userRole]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };
  const handleDeleteUser = async (userId) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this user?"
  );

  if (!confirmed) return;

  try {
    await axios.delete(
      `${API_URL}/api/auth/users/${userId}`
    );

    alert("User deleted successfully");

    const response = await axios.get(
      `${API_URL}/api/analytics/admin-dashboard`
    );

    setDashboard(response.data);
  } catch (error) {
    alert(
      error.response?.data?.message ||
        "Failed to delete user"
    );
  }
};
const handleDeleteEvent = async (eventId) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this event?"
  );

  if (!confirmed) return;

  try {
    await axios.delete(
      `${API_URL}/api/events/${eventId}`
    );

    alert("Event deleted successfully");

    const response = await axios.get(
      `${API_URL}/api/analytics/admin-dashboard`
    );

    setDashboard(response.data);
  } catch (error) {
    alert(
      error.response?.data?.message ||
      "Failed to delete event"
    );
  }
};
  if (!user || user.role !== "admin") {
    return null;
  }

  if (!dashboard) {
    return (
      <main className="min-h-screen bg-slate-100 p-6">
        <p className="font-bold">{t("loadingAdminDashboard")}</p>
      </main>
    );
  }

  const cards = dashboard.cards || {};
  const query = searchTerm.trim().toLowerCase();
  const matchesQuery = (values) =>
    !query ||
    values.some((value) =>
      String(value || "").toLowerCase().includes(query)
    );
  const filteredUsers = dashboard.users.filter((item) =>
    matchesQuery([item.name, item.email, item.role, item.language])
  );
  const filteredOrganizers = dashboard.organizers.filter((item) =>
    matchesQuery([item.name, item.totalEvents, item.totalRevenue])
  );
 
  const filteredEvents = dashboard.events.filter((item) =>
    matchesQuery([
      item.eventName,
      item.organizerName,
      item.date,
      item.bookings,
    ])
  );
  
  return (
    <main className="admin-dashboard">
      <div>
   
        <section className="admin-content">
          <div className="mx-auto max-w-7xl">
<div className="admin-header">

  <div>

    <h1 className="admin-page-title">
      EVENTORA ADMIN DASHBOARD
    </h1>

    <p className="admin-page-subtitle">
      Manage Events. Measure Success.
    </p>

  </div>

</div>
<div className="admin-actions">

   <button
    className="dashboard-btn"
    onClick={() => navigate("/admin-analytics")}
  >
    Date Wise Analytics
  </button>

  <button
    className="dashboard-btn"
    onClick={() => navigate("/admin-event-analytics")}
  >
    Event Wise Analytics
  </button>

  <button
    className="dashboard-btn"
    onClick={() => navigate("/admin-organizer-analytics")}
  >
    Organizer Wise Analytics
  </button>

  <button
    className="header-logout-btn"
    onClick={handleLogout}
  >
    Logout
  </button>

</div>
            <section
  id="platform-analytics"
  className="admin-stats-grid"
>
              <StatCard icon="👥" label={t("totalUsers")} value={cards.totalUsers || 0} />
<StatCard icon="🎫" label={t("totalEvents")} value={cards.totalEvents || 0} />
<StatCard icon="📖" label={t("totalBookings")} value={cards.totalBookings || 0} />
<StatCard icon="💰" label={t("totalRevenue")} value={`₹${cards.totalRevenue || 0}`} />
  
            </section>
            <div className="summary-grid">

  <div className="summary-card">

    <h3>Platform Summary</h3>

    <p>
      Total Organizers :
      {cards.totalOrganizers || 0}
    </p>

    <p>
      Total Participants :
      {cards.totalParticipants || 0}
    </p>

    <p>
      Languages : 5
    </p>

    <p>
      Revenue / Event :
      INR {
        Math.round(
          (cards.totalRevenue || 0) /
          Math.max(cards.totalEvents || 1, 1)
        )
      }
    </p>

  </div>

  <div className="summary-card">

    <h3>Quick Insights</h3>

    <p>
      Top Event :
      {cards.mostPopularEvent || "N/A"}
    </p>

    <p>
      Top Organizer :
      {cards.topOrganizer || "N/A"}
    </p>

  </div>

</div>
<div className="management-section">

  <div className="management-title">
    Management Center
  </div>

  <div className="management-tabs">

    <button
  className={activeTab === "users" ? "tab-btn active" : "tab-btn"}
  onClick={() => setActiveTab("users")}
>
  Users
</button>

<button
  className={activeTab === "organizers" ? "tab-btn active" : "tab-btn"}
  onClick={() => setActiveTab("organizers")}
>
  Organizers
</button>

<button
  className={activeTab === "events" ? "tab-btn active" : "tab-btn"}
  onClick={() => setActiveTab("events")}
>
  Events
</button>

  </div>

</div>

            <div className="grid gap-8">
              {activeTab === "users" && (
<section id="users">
                <DashboardSection title={t("usersTable")}>
                  <DataTable
                    rows={filteredUsers}
                    emptyTitle={t("noUsersFound")}
                    columns={[
  {
    key: "name",
    header: t("name"),
    render: (item) => (
      <span className="font-bold">
        {item.name}
      </span>
    ),
  },
  {
    key: "email",
    header: t("email"),
  },
  {
    key: "role",
    header: t("role"),
    render: (item) => (
      <span className="capitalize">
        {item.role}
      </span>
    ),
  },
  {
    key: "language",
    header: t("language"),
    render: (item) =>
      item.language || t("notAvailable"),
  },
  {
    key: "actions",
    header: "Actions",
    render: (item) =>
  item.role === "admin" ? (
    <span>Protected</span>
  ) : (
    <button
      className="eventora-delete-btn"
      onClick={() =>
        handleDeleteUser(item._id)
      }
    >
      Delete
    </button>
  ),
  },
]}
                  />
                </DashboardSection>
              </section>
              )}

              {activeTab === "organizers" && (
<section id="organizers">
                <DashboardSection title={t("organizersTable")}>
                  <DataTable
                    rows={filteredOrganizers}
                    emptyTitle={t("noOrganizersFound")}
                    columns={[
                      { key: "name", header: t("organizerName"), render: (item) => <span className="font-bold">{item.name}</span> },
                      { key: "totalEvents", header: t("totalEvents") },
                      { key: "totalRevenue", header: t("totalRevenue"), render: (item) => `INR ${item.totalRevenue}` },
                    ]}
                  />
                </DashboardSection>
              </section>
              )}

              {activeTab === "events" && (
<section id="events">
                <DashboardSection title={t("eventsTable")}>
                  <DataTable
                    rows={filteredEvents}
                    emptyTitle={t("noEventsFound")}
                    columns={[
  {
    key: "eventName",
    header: t("eventName"),
    render: (item) => (
      <span className="font-bold">
        {item.eventName}
      </span>
    ),
  },
  {
    key: "organizerName",
    header: t("organizer"),
  },
  {
    key: "date",
    header: t("date"),
  },
  {
    key: "bookings",
    header: t("bookings"),
  },
  {
    key: "actions",
    header: "Actions",
    render: (item) => (
      <button
  className="eventora-delete-btn"
  onClick={() =>
    handleDeleteUser(item._id)
  }
>
  Delete
</button>
    ),
  },
]}
                  />
                </DashboardSection>
              </section>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default AdminDashboardPage;
