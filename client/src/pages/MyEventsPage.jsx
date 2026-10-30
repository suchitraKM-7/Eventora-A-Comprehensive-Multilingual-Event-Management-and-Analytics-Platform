import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { API_URL, getStoredUser } from "../config";
import useUserLanguage from "../hooks/useUserLanguage";
import EmptyState from "../components/ui/EmptyState";

function MyEventsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const user = getStoredUser();
  useUserLanguage();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/events/organizer/${user.id}`);
      setEvents(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    const confirmDelete = window.confirm(t("confirmDeleteEvent"));

    if (!confirmDelete) return;

    try {
      await axios.delete(`${API_URL}/api/events/${eventId}`);
      setEvents(events.filter((event) => event._id !== eventId));
      alert(t("eventDeletedSuccessfully"));
    } catch (error) {
      console.error(error);
      alert(t("deleteFailed"));
    }
  };

  useEffect(() => {
    if (!user || user.role !== "organizer") {
      navigate("/login");
      return;
    }

    queueMicrotask(fetchEvents);
  }, []);

  if (!user || user.role !== "organizer") {
    return null;
  }

  return (
    <main className="organizer-event-page">
      <div className="organizer-event-container">
        <div className="my-events-header">
          <button
            type="button"
            onClick={() => navigate("/organizer-dashboard")}
            className="back-btn"
          >
            {t("backToDashboard")}
          </button>

          <div className="header-top">
            <div>
              <p className="header-role">{t("organizer")}</p>
              <h1 className="my-events-title">{t("myEvents")}</h1>
              <p className="my-events-subtitle">{t("eventsCreatedByOrganizer")}</p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/create-event")}
              className="create-event-btn"
            >
              {t("createEvent")}
            </button>
          </div>
        </div>

        {loading ? (
          <p>{t("loadingEvents")}</p>
        ) : events.length === 0 ? (
          <EmptyState title={t("noEventsFound")} />
        ) : (
          <div className="events-list">
            {events.map((event) => (
              <article key={event._id} className="organizer-event-card">
                {event.image ? (
                  <img
                    src={event.image}
                    alt={event.eventName}
                    className="organizer-event-image"
                  />
                ) : (
                  <div className="event-image-placeholder">{event.eventName}</div>
                )}

                <div className="organizer-event-content">
                  <div className="event-top">
                    <h2 className="organizer-event-title">{event.eventName}</h2>
                    <div className="organizer-event-category">{event.category}</div>
                  </div>

                  <div className="organizer-event-meta">
                    <span>{t("venue")}: {event.venue}</span>
                    <span>{t("date")}: {event.date}</span>
                    <span>{t("price")}: INR {event.price}</span>
                    <span>{event.availableSeats} {t("seatsAvailable")}</span>
                  </div>

                  <div className="organizer-event-actions">
                    <button
                      onClick={() => navigate(`/edit-event/${event._id}`)}
                      className="organizer-event-action-btn"
                    >
                      {t("editEvent")}
                    </button>
                    <button
                      onClick={() => handleDeleteEvent(event._id)}
                      className="organizer-event-action-btn"
                    >
                      {t("deleteEvent")}
                    </button>
                    <button
                      onClick={() => navigate(`/event-attendance/${event._id}`)}
                      className="organizer-event-action-btn"
                    >
                      {t("attendance")}
                    </button>
                    <button
                      onClick={() => navigate(`/event-bookings/${event._id}`)}
                      className="organizer-event-action-btn"
                    >
                      {t("bookings")}
                    </button>
                    <button
                      onClick={() => navigate(`/event-feedback/${event._id}`)}
                      className="organizer-event-action-btn"
                    >
                      {t("feedback")}
                    </button>
                    <button
                      onClick={() => navigate(`/event-analytics/${event._id}`)}
                      className="organizer-event-action-btn"
                    >
                      {t("analytics")}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default MyEventsPage;
