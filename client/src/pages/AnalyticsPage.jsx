import { useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { API_URL, getStoredUser } from "../config";
import useUserLanguage from "../hooks/useUserLanguage";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

function AnalyticsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const user = getStoredUser();
  const [analytics, setAnalytics] = useState(null);
  useUserLanguage();

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/analytics/organizer/${user.id}`
      );

      setAnalytics(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!user || user.role !== "organizer") {
      window.location.href = "/login";
      return;
    }

    queueMicrotask(fetchAnalytics);
  }, []);

  if (!analytics) {
    return (
      <main className="min-h-screen bg-slate-100 p-6">
        <p className="font-bold text-slate-700">{t("loadingAnalytics")}</p>
      </main>
    );
  }

  const bookingData = [
    { name: t("activeBookings"), value: analytics.activeBookings },
    { name: t("cancelledBookings"), value: analytics.cancelledBookings },
  ];

  const totalStatusBookings =
    (analytics.activeBookings || 0) + (analytics.cancelledBookings || 0);

  const percentage = (value) =>
    totalStatusBookings ? Math.round((value / totalStatusBookings) * 100) : 0;

  const summaryRows = [
    [t("grossRevenue"), `INR ${analytics.grossRevenue || 0}`],
    [t("refundedRevenue"), `INR ${analytics.refundedRevenue || 0}`],
    [t("netRevenue"), `INR ${analytics.netRevenue || 0}`],
    [t("totalBookings"), analytics.totalBookings || 0],
    [t("activeBookings"), analytics.activeBookings || 0],
    [t("cancelledBookings"), analytics.cancelledBookings || 0],
    [t("averageTicketPrice"), `INR ${analytics.averageTicketPrice || 0}`],
    [
      t("highestRevenueEvent"),
      analytics.highestRevenueEvent ||
        analytics.topPerformingEvent ||
        t("notAvailable"),
    ],
    [t("mostPopularEvent"), analytics.mostPopularEvent || t("notAvailable")],
    [t("ticketsSold"), analytics.ticketsSold || 0],
    [
      t("occupancyPercentage"),
      `${Number(analytics.occupancyPercentage || 0).toFixed(2)}%`,
    ],
    [
      t("averageRating"),
      `${Number(analytics.averageRating || 0).toFixed(1)}/5`,
    ],
  ];

  const COLORS = ["#22c55e", "#ef4444"];

  return (
    <main className="analytics-page">
      <div className="analytics-container">
        <div className="analytics-dashboard-header">
          <button
            type="button"
            onClick={() => navigate("/organizer-dashboard")}
            className="back-btn"
          >
            {t("backToDashboard")}
          </button>

          <h1 className="dashboard-title">{t("analyticsDashboard")}</h1>
          <p className="dashboard-subtitle">{t("analyticsDashboardSubtitle")}</p>
        </div>

        <div className="analytics-stats">
          <div className="analytics-stat-card">
            <span>INR</span>
            <div>
              <p>{t("revenue")}</p>
              <h3>INR {analytics.netRevenue || 0}</h3>
            </div>
          </div>

          <div className="analytics-stat-card">
            <span>#</span>
            <div>
              <p>{t("ticketsSold")}</p>
              <h3>{analytics.ticketsSold || 0}</h3>
            </div>
          </div>

          <div className="analytics-stat-card">
            <span>RT</span>
            <div>
              <p>{t("rating")}</p>
              <h3>{Number(analytics.averageRating || 0).toFixed(1)}</h3>
            </div>
          </div>

          <div className="analytics-stat-card">
            <span>%</span>
            <div>
              <p>{t("occupancy")}</p>
              <h3>{Number(analytics.occupancyPercentage || 0).toFixed(0)}%</h3>
            </div>
          </div>
        </div>

        <section className="dashboard-card analytics-summary-section">
          <h2>{t("analyticsSummary")}</h2>

          <div className="summary-grid">
            <div>
              {summaryRows.slice(0, 6).map(([metric, value]) => (
                <div className="summary-row" key={metric}>
                  <span>{metric}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>

            <div>
              {summaryRows.slice(6, 12).map(([metric, value]) => (
                <div className="summary-row" key={metric}>
                  <span>{metric}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="analytics-grid-row">
          <section className="dashboard-card revenue-section">
            <h2>{t("revenuePerformance")}</h2>

            <div className="health-item">
              <span>{t("grossRevenue")}</span>
              <div className="custom-progress">
                <div className="custom-progress-fill" style={{ width: "100%" }}></div>
              </div>
              <strong>100%</strong>
            </div>

            <div className="health-item">
              <span>{t("refundedRevenue")}</span>
              <div className="custom-progress">
                <div
                  className="custom-progress-fill"
                  style={{
                    width: `${
                      analytics.grossRevenue
                        ? (analytics.refundedRevenue / analytics.grossRevenue) * 100
                        : 0
                    }%`,
                  }}
                ></div>
              </div>
              <strong>
                {analytics.grossRevenue
                  ? Math.round(
                      (analytics.refundedRevenue / analytics.grossRevenue) * 100
                    )
                  : 0}
                %
              </strong>
            </div>

            <div className="health-item">
              <span>{t("netRevenue")}</span>
              <div className="custom-progress">
                <div
                  className="custom-progress-fill"
                  style={{
                    width: `${
                      analytics.grossRevenue
                        ? (analytics.netRevenue / analytics.grossRevenue) * 100
                        : 0
                    }%`,
                  }}
                ></div>
              </div>
              <strong>
                {analytics.grossRevenue
                  ? Math.round((analytics.netRevenue / analytics.grossRevenue) * 100)
                  : 0}
                %
              </strong>
            </div>
          </section>

          <section className="dashboard-card booking-section">
            <h2 className="mb-4 text-xl font-black text-slate-950">
              {t("bookingStatusDistribution")}
            </h2>
            <div className="booking-content">
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={bookingData} dataKey="value" outerRadius={100} label>
                    {bookingData.map((entry, index) => (
                      <Cell key={entry.name} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>

              <div className="booking-legend">
                <div className="legend-item">
                  <span className="legend-dot active"></span>
                  <div>
                    <p>{t("activeBookings")}</p>
                    <strong>
                      {analytics.activeBookings || 0} (
                      {percentage(analytics.activeBookings || 0)}%)
                    </strong>
                  </div>
                </div>

                <div className="legend-item">
                  <span className="legend-dot cancelled"></span>
                  <div>
                    <p>{t("cancelledBookings")}</p>
                    <strong>
                      {analytics.cancelledBookings || 0} (
                      {percentage(analytics.cancelledBookings || 0)}%)
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <section className="dashboard-card insights-section">
          <h2>{t("eventInsights")}</h2>

          <div className="insights-grid">
            <div className="insight-box">
              <h4>{t("mostPopularEvent")}</h4>
              <strong>{analytics.mostPopularEvent || t("notAvailable")}</strong>
            </div>

            <div className="insight-box">
              <h4>{t("highestRevenueEvent")}</h4>
              <strong>{analytics.highestRevenueEvent || t("notAvailable")}</strong>
            </div>

            <div className="insight-box">
              <h4>{t("averageRating")}</h4>
              <strong>{Number(analytics.averageRating || 0).toFixed(1)}/5</strong>
            </div>

            <div className="insight-box">
              <h4>{t("occupancy")}</h4>
              <strong>{Number(analytics.occupancyPercentage || 0).toFixed(0)}%</strong>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default AnalyticsPage;
