import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { API_URL } from "../config";
import useUserLanguage from "../hooks/useUserLanguage";
import { getStatusLabel } from "../helpers/statusLabels";

function VerifyTicketPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [ticketNumber, setTicketNumber] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  useUserLanguage();

  const handleVerify = async (event) => {
    event.preventDefault();
    setResult(null);
    setError("");

    try {
      const response = await axios.post(`${API_URL}/api/bookings/verify-ticket`, {
        ticketNumber,
      });

      setResult(response.data);
    } catch (error) {
      setError(error.response?.data?.message || t("invalidTicket"));
    }
  };

  return (
    <main className="verify-page">
      <div className="verify-container">
        <button
          type="button"
          onClick={() => navigate("/organizer-dashboard")}
          className="back-btn"
        >
          {t("backToDashboard")}
        </button>

        <div className="verify-header">
          <div>
            <h1 className="verify-title">{t("verifyTicket")}</h1>
            <p className="verify-subtitle">{t("verifyTicketSubtitle")}</p>
          </div>
        </div>

        <div className="verify-grid">
          <div className="verify-card">
            <h2>
              <span className="verify-icon">#</span>
              {t("ticketNumber")}
            </h2>
            <p>{t("enterOrScanTicketNumber")}</p>

            <form onSubmit={handleVerify}>
              <input
                type="text"
                value={ticketNumber}
                onChange={(e) => setTicketNumber(e.target.value)}
                placeholder={t("enterTicketNumber")}
                className="verify-input"
                required
              />

              <button type="submit" className="verify-btn">
                {t("verifyTicket")}
              </button>
            </form>
          </div>

          {result && (
            <div className="verify-card">
              <h2>
                <span className="verify-icon">i</span>
                {t("ticketInformation")}
              </h2>
              <div className="ticket-details">
                <div className="ticket-row">
                  <span>{t("name")}</span>
                  <strong>{result.participantName}</strong>
                </div>

                <div className="ticket-row">
                  <span>{t("event")}</span>
                  <strong>{result.eventName}</strong>
                </div>

                <div className="ticket-row">
                  <span>{t("seat")}</span>
                  <strong>{result.seatNumber}</strong>
                </div>

                <div className="ticket-row">
                  <span>{t("status")}</span>
                  <strong className="status-active">{t("statusBooked")}</strong>
                </div>

                <div className="ticket-row">
                  <span>{t("attendance")}</span>
                  <span className="status-badge">
                    {getStatusLabel(t, result.attendanceStatus)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {error && <div className="verify-error">{error}</div>}
      </div>
    </main>
  );
}

export default VerifyTicketPage;
