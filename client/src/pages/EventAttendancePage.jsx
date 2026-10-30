import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { API_URL, getStoredUser } from "../config";
import EmptyState from "../components/ui/EmptyState";
import useUserLanguage from "../hooks/useUserLanguage";
import { getStatusLabel } from "../helpers/statusLabels";

function EventAttendancePage() {
  const { t } = useTranslation();
  const { eventId } = useParams();
  const navigate = useNavigate();
  const user = getStoredUser();

  const [event, setEvent] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  useUserLanguage();

  const fetchAttendance = async () => {
    try {
      const [eventResponse, bookingsResponse] = await Promise.all([
        axios.get(`${API_URL}/api/events/${eventId}`),
        axios.get(`${API_URL}/api/bookings/event/${eventId}?organizerId=${user.id}`),
      ]);

      if (String(eventResponse.data.organizerId) !== String(user.id)) {
        navigate("/my-events");
        return;
      }

      setEvent(eventResponse.data);
      setBookings(bookingsResponse.data);
    } catch (error) {
      alert(error.response?.data?.message || t("unableToLoadAttendance"));
      navigate("/my-events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user || user.role !== "organizer") {
      navigate("/login");
      return;
    }

    queueMicrotask(fetchAttendance);
  }, []);

  const activeBookings = useMemo(
    () => bookings.filter((booking) => booking.status !== "Cancelled"),
    [bookings]
  );

  const checkedIn = activeBookings.filter(
    (booking) => booking.attendanceStatus === "Checked-In"
  ).length;

  const handleMarkCheckedIn = async (bookingId) => {
    try {
      const response = await axios.put(`${API_URL}/api/bookings/attendance/${bookingId}`);
      alert(response.data.message);
      fetchAttendance();
    } catch (error) {
      alert(error.response?.data?.message || t("attendanceFailed"));
    }
  };

  if (!user || user.role !== "organizer") {
    return null;
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-100 p-6">
        <p className="font-bold text-slate-700">{t("loadingAttendance")}</p>
      </main>
    );
  }

  return (
    <main className="attendance-page">
      <div className="attendance-container">
        <button type="button" onClick={() => navigate("/my-events")} className="back-btn">
          {t("backToMyEvents")}
        </button>

        <div className="attendance-header">
          <div>
            <h1 className="attendance-title">{t("attendanceManagement")}</h1>
            <h2 className="attendance-event-name">{event?.eventName}</h2>
            <p className="attendance-subtitle">{t("attendanceManagementSubtitle")}</p>
          </div>

          <img src="/images/attendance-icon.png" alt={t("attendance")} className="attendance-icon" />
        </div>

        <div className="attendance-stats">
          <div className="attendance-stat-card">
            <span className="stat-icon">#</span>
            <div>
              <p>{t("totalAttendees")}</p>
              <h3>{activeBookings.length}</h3>
            </div>
          </div>

          <div className="attendance-stat-card checked">
            <span className="stat-icon">OK</span>
            <div>
              <p>{t("checkedIn")}</p>
              <h3>{checkedIn}</h3>
            </div>
          </div>

          <div className="attendance-stat-card pending">
            <span className="stat-icon">...</span>
            <div>
              <p>{t("pending")}</p>
              <h3>{activeBookings.length - checkedIn}</h3>
            </div>
          </div>
        </div>

        {activeBookings.length === 0 ? (
          <EmptyState title={t("noAttendanceRecords")} />
        ) : (
          <div className="attendance-table-card">
            <div className="attendance-table-header">
              <span className="attendance-table-icon">#</span>
              <h3 className="attendance-table-title">{t("participantAttendanceList")}</h3>
            </div>

            <table className="attendance-table">
              <thead>
                <tr>
                  <th>{t("name")}</th>
                  <th>{t("ticketNumber")}</th>
                  <th>{t("seat")}</th>
                  <th>{t("status")}</th>
                  <th>{t("action")}</th>
                </tr>
              </thead>

              <tbody>
                {activeBookings.map((booking) => (
                  <tr key={booking._id}>
                    <td>{booking.userId?.name}</td>
                    <td>{booking.ticketNumber}</td>
                    <td>{booking.seatNumber}</td>
                    <td>
                      <span
                        className={
                          booking.attendanceStatus === "Checked-In"
                            ? "status-checked"
                            : "status-pending"
                        }
                      >
                        {booking.attendanceStatus === "Checked-In"
                          ? getStatusLabel(t, "Checked-In")
                          : t("pending")}
                      </span>
                    </td>
                    <td>
                      {booking.attendanceStatus === "Checked-In" ? (
                        <button disabled className="attendance-done-btn">
                          {t("checkedIn")}
                        </button>
                      ) : (
                        <button
                          onClick={() => handleMarkCheckedIn(booking._id)}
                          className="attendance-check-btn"
                        >
                          {t("checkIn")}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}

export default EventAttendancePage;
