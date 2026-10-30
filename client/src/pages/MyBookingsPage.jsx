import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { API_URL, getStoredUser } from "../config";
import BookingCard from "../components/dashboard/BookingCard";
import EmptyState from "../components/ui/EmptyState";
import useUserLanguage from "../hooks/useUserLanguage";

function MyBookingsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const user = getStoredUser();
  const userId = user?.id;
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [bookings, setBookings] = useState([]);
  useUserLanguage();

  const fetchBookings = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/api/bookings/${userId}`);
      setBookings(response.data);
    } catch (error) {
      console.log(error);
    }
  }, [userId]);

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }

    queueMicrotask(fetchBookings);
  }, [fetchBookings, navigate, userId]);

  const handleCancelBooking = async (bookingId) => {
    const confirmCancel = window.confirm(t("confirmCancelBooking"));

    if (!confirmCancel) return;

    try {
      await axios.put(`${API_URL}/api/bookings/cancel/${bookingId}`);
      alert(t("bookingCancelledSuccessfully"));
      fetchBookings();
    } catch (error) {
      alert(error.response?.data?.message || t("cancellationFailed"));
    }
  };

  const handleFeedbackSubmit = async () => {
    try {
      await axios.post(`${API_URL}/api/feedback`, {
        userId,
        eventId: selectedBooking.eventId._id,
        rating,
        comment,
      });

      alert(t("feedbackSubmitted"));
      setSelectedBooking(null);
      setRating(5);
      setComment("");
    } catch (error) {
      alert(error.response?.data?.message || t("feedbackFailed"));
    }
  };

  const activeBookings = bookings.filter((booking) => booking.status === "Booked");
  const cancelledBookings = bookings.filter(
    (booking) => booking.status === "Cancelled"
  );

  const renderBooking = (booking, statusTone = "active") => (
    <BookingCard
      key={booking._id}
      booking={booking}
      t={t}
      statusTone={statusTone}
      onViewTicket={() => navigate(`/ticket/${booking._id}`)}
      onCancelBooking={() => handleCancelBooking(booking._id)}
      onFeedbackOpen={() => setSelectedBooking(booking)}
    />
  );

  return (
    <main className="my-bookings-page">
      <div className="eventora-navbar">
        <div>
          <h1 className="eventora-logo">{t("eventora")}</h1>
          <p className="eventora-tagline">{t("eventoraTagline")}</p>
        </div>
      </div>

      <div className="my-bookings-overlay">
        <div className="bookings-hero">
          <div className="hero-left">
            <div className="hero-icon">#</div>

            <div>
              <h1>{t("myBookings")}</h1>
              <p>{t("myBookingsSubtitle")}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate("/participant-dashboard")}
            className="dashboard-btn"
          >
            {t("backToDashboard")}
          </button>
        </div>

        {bookings.length === 0 ? (
          <EmptyState title={t("noBookings")} message={t("noActiveBookings")} />
        ) : (
          <>
            <section className="mt-6">
              <h2 className="booking-section-title">{t("activeBookings")}</h2>

              {activeBookings.length === 0 ? (
                <EmptyState title={t("noActiveBookings")} />
              ) : (
                <div className="grid gap-5 grid-cols-1">
                  {activeBookings.map((booking) => renderBooking(booking))}
                </div>
              )}
            </section>

            <section className="mt-8">
              <h2 className="booking-section-title cancelled">
                {t("cancelledBookings")}
              </h2>

              {cancelledBookings.length === 0 ? (
                <EmptyState title={t("noCancelledBookings")} />
              ) : (
                <div className="grid gap-5 grid-cols-1">
                  {cancelledBookings.map((booking) =>
                    renderBooking(booking, "cancelled")
                  )}
                </div>
              )}
            </section>
          </>
        )}
      </div>

      {selectedBooking && (
        <div className="feedback-modal">
          <div className="feedback-modal-content">
            <h2>{t("rateThisEvent")}</h2>

            <label>{t("rating")}</label>
            <select
              value={rating}
              onChange={(event) => setRating(Number(event.target.value))}
            >
              {[5, 4, 3, 2, 1].map((value) => (
                <option key={value} value={value}>
                  {value === 1
                    ? t("star", { count: value })
                    : t("stars", { count: value })}
                </option>
              ))}
            </select>

            <label>{t("comment")}</label>
            <textarea
              placeholder={t("writeYourFeedback")}
              value={comment}
              onChange={(event) => setComment(event.target.value)}
            />

            <button className="submit-feedback-btn" onClick={handleFeedbackSubmit}>
              {t("submitFeedback")}
            </button>

            <button
              className="close-feedback-btn"
              onClick={() => setSelectedBooking(null)}
            >
              {t("cancel")}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

export default MyBookingsPage;
