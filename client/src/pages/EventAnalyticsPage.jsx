import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { API_URL, getStoredUser } from "../config";
import EmptyState from "../components/ui/EmptyState";
import useUserLanguage from "../hooks/useUserLanguage";

function EventAnalyticsPage() {
  const { t } = useTranslation();
  const { eventId } = useParams();
  const navigate = useNavigate();
  const user = getStoredUser();

  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  useUserLanguage();

  useEffect(() => {
    if (!user || user.role !== "organizer") {
      navigate("/login");
      return;
    }

    const fetchAnalytics = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/analytics/event/${eventId}?organizerId=${user.id}`
        );

        setAnalytics(response.data);
      } catch (error) {
        alert(error.response?.data?.message || t("unableToLoadAnalytics"));
        navigate("/my-events");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (!user || user.role !== "organizer") {
    return null;
  }

  return (
    <main className="analytics-page">
      <div className="analytics-container">
        <button type="button" onClick={() => navigate("/my-events")} className="back-btn">
          {t("backToMyEvents")}
        </button>

        {loading ? (
          <p className="loading-text">{t("loadingAnalytics")}</p>
        ) : !analytics ? (
          <EmptyState title={t("noAnalyticsAvailable")} />
        ) : (
          <>
            <div className="analytics-header">
              <div>
                <h1 className="analytics-title">{t("eventAnalytics")}</h1>
                <h2 className="analytics-event-name">{analytics.eventName}</h2>
                <p className="analytics-subtitle">{t("eventAnalyticsSubtitle")}</p>
              </div>
            </div>

            <div className="analytics-stats">
              <div className="analytics-stat-card">
                <span className="stat-icon">INR</span>
                <div>
                  <p>{t("revenue")}</p>
                  <h3>INR {analytics.revenue || 0}</h3>
                </div>
              </div>

              <div className="analytics-stat-card">
                <span className="stat-icon">#</span>
                <div>
                  <p>{t("bookings")}</p>
                  <h3>{analytics.totalBookings || 0}</h3>
                </div>
              </div>

              <div className="analytics-stat-card">
                <span className="stat-icon">%</span>
                <div>
                  <p>{t("attendance")}</p>
                  <h3>{Number(analytics.attendancePercentage || 0).toFixed(0)}%</h3>
                </div>
              </div>

              <div className="analytics-stat-card">
                <span className="stat-icon">RT</span>
                <div>
                  <p>{t("rating")}</p>
                  <h3>{Number(analytics.averageRating || 0).toFixed(1)}</h3>
                </div>
              </div>

              <div className="analytics-stat-card">
                <span className="stat-icon">SE</span>
                <div>
                  <p>{t("seatsLeft")}</p>
                  <h3>{analytics.availableSeats || 0}</h3>
                </div>
              </div>
            </div>

            <div className="analytics-summary-card">
              <h3>{t("eventPerformanceSummary")}</h3>

              <div className="summary-row">
                <span>{t("revenueGenerated")}</span>
                <strong>INR {analytics.revenue || 0}</strong>
              </div>
              <div className="summary-row">
                <span>{t("totalBookings")}</span>
                <strong>{analytics.totalBookings || 0}</strong>
              </div>
              <div className="summary-row">
                <span>{t("attendanceCount")}</span>
                <strong>{analytics.attendanceCount || 0}</strong>
              </div>
              <div className="summary-row">
                <span>{t("attendancePercentage")}</span>
                <strong>{Number(analytics.attendancePercentage || 0).toFixed(0)}%</strong>
              </div>
              <div className="summary-row">
                <span>{t("averageRating")}</span>
                <strong>{Number(analytics.averageRating || 0).toFixed(1)}/5</strong>
              </div>
              <div className="summary-row">
                <span>{t("availableSeats")}</span>
                <strong>{analytics.availableSeats || 0}</strong>
              </div>
            </div>

            <div className="analytics-health-card">
              <h3>{t("eventHealthScore")}</h3>

              <div className="health-item">
                <div className="health-label">
                  <span>{t("attendance")}</span>
                  <span>{Number(analytics.attendancePercentage || 0).toFixed(0)}%</span>
                </div>
                <div className="custom-progress">
                  <div
                    className="attendance-fill"
                    style={{ width: `${analytics.attendancePercentage || 0}%` }}
                  ></div>
                </div>
              </div>

              <div className="health-item">
                <span>{t("occupancy")}</span>
                <div className="custom-progress">
                  <div
                    className="occupancy-fill"
                    style={{
                      width: `${Math.max(analytics.occupancyPercentage || 0, 5)}%`,
                    }}
                  ></div>
                </div>
                <strong>{Number(analytics.occupancyPercentage || 0).toFixed(0)}%</strong>
              </div>

              <div className="health-item">
                <div className="health-label">
                  <span>{t("rating")}</span>
                  <span>{Number(analytics.averageRating || 0).toFixed(1)}/5</span>
                </div>
                <div className="custom-progress">
                  <div
                    className="rating-fill"
                    style={{ width: `${((analytics.averageRating || 0) / 5) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

export default EventAnalyticsPage;
