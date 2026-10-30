import { getStatusLabel } from "../../helpers/statusLabels";

function BookingCard({
  booking,
  t,
  onViewTicket,
  onCancelBooking,
  onFeedbackOpen,
}) {
  const isCancelled = booking.status === "Cancelled";

  return (
    <div className="eventora-booking-card">
      <div className="booking-image">
        <img
          src={
            booking.eventId?.image ||
            "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f"
          }
          alt={booking.eventId?.eventName}
        />
      </div>

      <div className="booking-info">
        <div className="info-block">
          <span>{t("event")}</span>
          <h4>{booking.eventId?.eventName}</h4>
        </div>

        <div className="info-block">
          <span>{t("venue")}</span>
          <h4>{booking.eventId?.venue}</h4>
        </div>

        <div className="info-block">
          <span>{t("seatNumber")}</span>
          <h4>{booking.seatNumber || t("notAvailable")}</h4>
        </div>
      </div>

      <div className="booking-middle">
        <div className="info-block">
          <span>{t("ticketNumber")}</span>
          <h4>{booking.ticketNumber || t("notAvailable")}</h4>
        </div>

        <div className="info-block">
          <span>{t("status")}</span>
          <div className={`status-badge ${isCancelled ? "cancelled" : "active"}`}>
            {getStatusLabel(t, booking.status)}
          </div>
        </div>

        {!isCancelled && (
          <div className="info-block">
            <span>{t("attendance")}</span>
            <div className="status-badge attendance">
              {getStatusLabel(t, booking.attendanceStatus || "Booked")}
            </div>
          </div>
        )}
      </div>

      <div className="booking-actions">
        {!isCancelled && (
          <>
            <button onClick={onViewTicket} className="view-ticket-btn">
              {t("viewTicket")}
            </button>
            <button onClick={onFeedbackOpen} className="feedback-btn">
              {t("giveFeedback")}
            </button>
            <button onClick={onCancelBooking} className="cancel-ticket-btn">
              {t("cancelBooking")}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default BookingCard;
