import { Navigate, Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ParticipantDashboardPage from "./pages/ParticipantDashboardPage";
import CreateEventPage from "./pages/CreateEventPage";
import EditEventPage from "./pages/EditEventPage";
import TicketPage from "./pages/TicketPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import OrganizerDashboardPage from "./pages/OrganizerDashboardPage";
import MyBookingsPage from "./pages/MyBookingsPage";
import MyEventsPage from "./pages/MyEventsPage";
import TestPage from "./pages/TestPage";
import VerifyTicketPage from "./pages/VerifyTicketPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminAnalyticsPage from "./pages/AdminAnalyticsPage";
import EventAttendancePage from "./pages/EventAttendancePage";
import EventBookingsPage from "./pages/EventBookingsPage";
import EventFeedbackPage from "./pages/EventFeedbackPage";
import EventAnalyticsPage from "./pages/EventAnalyticsPage";
import { getStoredUser } from "./config";
import AdminEventAnalyticsPage from "./pages/AdminEventAnalyticsPage";
import AdminOrganizerAnalyticsPage from "./pages/AdminOrganizerAnalyticsPage";
function ProtectedRoute({ children, role }) {
  const user = getStoredUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route path="/home" element={<HomePage />} />

      <Route
        path="/participant-dashboard"
        element={
          <ProtectedRoute role="participant">
            <ParticipantDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
  path="/admin-organizer-analytics"
  element={
    <AdminOrganizerAnalyticsPage />
  }
/>
      <Route
        path="/my-bookings"
        element={
          <ProtectedRoute role="participant">
            <MyBookingsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/organizer-dashboard"
        element={
          <ProtectedRoute role="organizer">
            <OrganizerDashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/my-events"
        element={
          <ProtectedRoute role="organizer">
            <MyEventsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/create-event"
        element={
          <ProtectedRoute role="organizer">
            <CreateEventPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/edit-event/:id"
        element={
          <ProtectedRoute role="organizer">
            <EditEventPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/ticket/:bookingId"
        element={
          <ProtectedRoute>
            <TicketPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/analytics"
        element={
          <ProtectedRoute role="organizer">
            <AnalyticsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/verify-ticket"
        element={
          <ProtectedRoute role="organizer">
            <VerifyTicketPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/event-attendance/:eventId"
        element={
          <ProtectedRoute role="organizer">
            <EventAttendancePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/event-bookings/:eventId"
        element={
          <ProtectedRoute role="organizer">
            <EventBookingsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/event-feedback/:eventId"
        element={
          <ProtectedRoute role="organizer">
            <EventFeedbackPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/event-analytics/:eventId"
        element={
          <ProtectedRoute role="organizer">
            <EventAnalyticsPage />
          </ProtectedRoute>
        }
      />
       <Route
       path="/admin-event-analytics"
        element={<AdminEventAnalyticsPage />}
      />
      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute role="admin">
            <AdminDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
  path="/admin-analytics"
  element={<AdminAnalyticsPage />}
/>
      <Route
        path="/test"
        element={<TestPage />}
      />
    </Routes>
  );
}

export default App;
