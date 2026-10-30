import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useTranslation } from "react-i18next";
import { API_URL, getStoredUser } from "../config";
import useUserLanguage from "../hooks/useUserLanguage";
import { getStatusLabel } from "../helpers/statusLabels";
import { MdEventSeat } from "react-icons/md";
import { BsQrCodeScan } from "react-icons/bs";

function TicketPage() {
  const { t } = useTranslation();
  const { bookingId } = useParams();
  const user = getStoredUser();
  const [booking, setBooking] = useState(null);
  const ticketRef = useRef();
  useUserLanguage();

  const fetchTicket = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/bookings/ticket/${bookingId}`);
      setBooking(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!user) {
      window.location.href = "/login";
      return;
    }

    fetchTicket();
  }, []);

  const downloadPDF = async () => {
    try {
      const input = ticketRef.current;
      const canvas = await html2canvas(input);
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      const imgWidth = 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
      pdf.save(`${booking.ticketNumber}.pdf`);
    } catch (error) {
      console.log(error);
    }
  };

  if (!booking) {
    return (
      <div className="p-6">
        <h2>{t("loadingTicket")}</h2>
      </div>
    );
  }

  return (
    <div className="ticket-page">
      <div ref={ticketRef} className="eventora-ticket">
        <div className="ticket-header">
          <h1>{t("eventora")}</h1>
          <p className="ticket-tagline">{t("eventoraTagline")}</p>
        </div>

        <img
          src={
            booking.eventId?.image ||
            "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f"
          }
          alt={booking.eventId?.eventName || t("event")}
          className="ticket-image"
        />

        <div className="ticket-number">{booking.ticketNumber}</div>

        <div className="ticket-icons-row">
          <div className="ticket-icon-seat">
            <MdEventSeat />
          </div>

          <div className="ticket-icon-qr">
            <BsQrCodeScan />
          </div>
        </div>

        <div className="ticket-divider"></div>

        <div className="ticket-content">
          <div className="ticket-left">
            <p>
              <strong>{t("event")}:</strong> {booking.eventId?.eventName}
            </p>
            <p>
              <strong>{t("category")}:</strong> {booking.eventId?.category}
            </p>
            <p>
              <strong>{t("venue")}:</strong> {booking.eventId?.venue}
            </p>
            <p>
              <strong>{t("date")}:</strong> {booking.eventId?.date}
            </p>
            <p>
              <strong>{t("time")}:</strong> {booking.eventId?.time}
            </p>
          </div>

          <div className="ticket-center">
            <p>
              <strong>{t("seatNumber")}:</strong> {booking.seatNumber}
            </p>
            <p>
              <strong>{t("price")}:</strong> INR {booking.ticketPrice}
            </p>
            <p>
              <strong>{t("status")}:</strong> {getStatusLabel(t, booking.status)}
            </p>
          </div>

          <div className="ticket-right">
            <QRCodeCanvas
              value={JSON.stringify({
                ticketNumber: booking.ticketNumber,
                event: booking.eventId?.eventName,
                seat: booking.seatNumber,
                status: booking.status,
              })}
              size={140}
            />

            <p className="qr-text">{t("scanQrForVerification")}</p>
          </div>
        </div>
      </div>

      <button onClick={downloadPDF} className="download-ticket-btn">
        {t("downloadTicketPdf")}
      </button>
    </div>
  );
}

export default TicketPage;
