import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { API_URL, getStoredUser } from "../config";
import EmptyState from "../components/ui/EmptyState";
import useUserLanguage from "../hooks/useUserLanguage";

function EventFeedbackPage() {
  const { t } = useTranslation();
  const { eventId } = useParams();
  const navigate = useNavigate();
  const user = getStoredUser();

  const [event, setEvent] = useState(null);
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  useUserLanguage();

  useEffect(() => {
    if (!user || user.role !== "organizer") {
      navigate("/login");
      return;
    }

    const fetchFeedback = async () => {
      try {
        const eventResponse = await axios.get(`${API_URL}/api/events/${eventId}`);

        if (String(eventResponse.data.organizerId) !== String(user.id)) {
          navigate("/my-events");
          return;
        }

        const feedbackResponse = await axios.get(`${API_URL}/api/feedback/event/${eventId}`);

        setEvent(eventResponse.data);
        setFeedback(feedbackResponse.data);
      } catch (error) {
        alert(error.response?.data?.message || t("unableToLoadFeedback"));
        navigate("/my-events");
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, []);

  const averageRating = useMemo(() => {
    if (feedback.length === 0) return 0;

    const total = feedback.reduce((sum, item) => sum + item.rating, 0);
    return total / feedback.length;
  }, [feedback]);

  if (!user || user.role !== "organizer") {
    return null;
  }

  return (
    <main className="feedback-page">
      <div className="feedback-container">
        <button type="button" onClick={() => navigate("/my-events")} className="back-btn">
          {t("backToMyEvents")}
        </button>

        <div className="feedback-header">
          <div>
            <h1 className="feedback-title">{t("feedbackAnalytics")}</h1>
            <h2 className="feedback-event-name">{event?.eventName}</h2>
            <p className="feedback-subtitle">{t("feedbackAnalyticsSubtitle")}</p>
          </div>
        </div>

        <div className="feedback-stats">
          <div className="feedback-stat-card">
            <span className="stat-icon">*</span>
            <div>
              <p>{t("averageRating")}</p>
              <h3>{averageRating.toFixed(1)}</h3>
            </div>
          </div>

          <div className="feedback-stat-card">
            <span className="stat-icon">#</span>
            <div>
              <p>{t("feedbackCount")}</p>
              <h3>{feedback.length}</h3>
            </div>
          </div>

          <div className="feedback-stat-card">
            <span className="stat-icon">+</span>
            <div>
              <p>{t("positive")}</p>
              <h3>{feedback.filter((item) => item.rating >= 4).length}</h3>
            </div>
          </div>
        </div>

        {loading ? (
          <p className="font-bold text-slate-700">{t("loadingFeedback")}</p>
        ) : feedback.length === 0 ? (
          <EmptyState title={t("noFeedbackAvailable")} />
        ) : (
          <div className="feedback-table-card">
            <div className="feedback-title-row">
              <span className="feedback-title-icon">#</span>
              <h3 className="feedback-table-title">{t("participantFeedback")}</h3>
            </div>

            <table className="feedback-table">
              <thead>
                <tr>
                  <th>{t("name")}</th>
                  <th>{t("rating")}</th>
                  <th>{t("comment")}</th>
                </tr>
              </thead>

              <tbody>
                {feedback.map((item) => (
                  <tr key={item._id}>
                    <td>{item.userId?.name}</td>
                    <td>
                      <span className="rating-badge">{t("stars", { count: item.rating })}</span>
                    </td>
                    <td className="feedback-comment">{item.comment || t("noComment")}</td>
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

export default EventFeedbackPage;
