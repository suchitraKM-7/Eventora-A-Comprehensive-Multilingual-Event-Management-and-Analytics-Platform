import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { API_URL, getStoredUser } from "../config";
import EmptyState from "../components/ui/EmptyState";
import useUserLanguage from "../hooks/useUserLanguage";
import { getStatusLabel } from "../helpers/statusLabels";

function EventBookingsPage() {
  const { t } = useTranslation();
  const { eventId } = useParams();
  const navigate = useNavigate();
  const user = getStoredUser();

  const [event, setEvent] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  useUserLanguage();

  useEffect(() => {
    if (!user || user.role !== "organizer") {
      navigate("/login");
      return;
    }

    const fetchBookings = async () => {
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
        alert(error.response?.data?.message || t("unableToLoadBookings"));
        navigate("/my-events");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (!user || user.role !== "organizer") {
    return null;
  }

  const bookedCount = bookings.filter((booking) => booking.status === "Booked").length;
  const cancelledCount = bookings.filter((booking) => booking.status === "Cancelled").length;

  return (
    <main className="bookings-page">
      <div className="bookings-container">
        <button type="button" onClick={() => navigate("/my-events")} className="back-btn">
          {t("backToMyEvents")}
        </button>

        <div className="bookings-header">
          <div>
            <h1 className="bookings-title">{t("eventBookings")}</h1>
            <h2 className="bookings-event-name">{event?.eventName}</h2>
          </div>

          <img src="/images/bookings-icon.png" alt={t("bookings")} className="bookings-icon" />
        </div>

        <div className="bookings-stats">
          <div className="bookings-stat-card">
            <span className="stat-icon">#</span>
            <div>
              <p>{t("total")}</p>
              <h3>{bookings.length}</h3>
            </div>
          </div>

          <div className="bookings-stat-card">
            <span className="stat-icon">OK</span>
            <div>
              <p>{t("statusBooked")}</p>
              <h3>{bookedCount}</h3>
            </div>
          </div>

          <div className="bookings-stat-card">
            <span className="stat-icon">X</span>
            <div>
              <p>{t("statusCancelled")}</p>
              <h3>{cancelledCount}</h3>
            </div>
          </div>
        </div>

        {loading ? (
          <p className="mt-6 font-bold text-slate-700">{t("loadingBookings")}</p>
        ) : bookings.length === 0 ? (
          <EmptyState title={t("noActiveBookings")} />
        ) : (
          <div className="mt-6">
            <div className="bookings-table-card">
              <div className="table-title-row">
                <img src="/images/bookings-icon.png" alt="" className="table-icon" />
                <h3 className="bookings-table-title">{t("participantBookingList")}</h3>
              </div>

              <table className="bookings-table">
                <thead>
                  <tr>
                    <th>{t("name")}</th>
                    <th>{t("email")}</th>
                    <th>{t("seat")}</th>
                    <th>{t("bookingStatus")}</th>
                    <th>{t("attendanceStatus")}</th>
                  </tr>
                </thead>

                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking._id}>
                      <td>{booking.userId?.name}</td>
                      <td>{booking.userId?.email}</td>
                      <td>{booking.seatNumber}</td>
                      <td>
                        <span
                          className={
                            booking.status === "Cancelled"
                              ? "status-cancelled"
                              : "status-booked"
                          }
                        >
                          {getStatusLabel(t, booking.status)}
                        </span>
                      </td>
                      <td>
                        <span
                          className={
                            booking.attendanceStatus === "Checked-In"
                              ? "status-checked"
                              : booking.status === "Cancelled"
                                ? "status-cancelled"
                                : "status-pending"
                          }
                        >
                          {getStatusLabel(t, booking.attendanceStatus)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default EventBookingsPage;
