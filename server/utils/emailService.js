const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Booking Email
const sendBookingEmail = async (
  userEmail,
  eventName,
  ticketNumber
) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: "Event Booking Confirmation 🎉",
      html: `
        <h2>Booking Confirmed</h2>

        <p><b>Event:</b> ${eventName}</p>

        <p><b>Ticket Number:</b> ${ticketNumber}</p>

        <p>Thank you for booking with us.</p>
      `,
    });

    console.log("Booking Email Sent");
  } catch (error) {
    console.log(error);
  }
};

// Cancellation Email
const sendCancellationEmail = async (
  userEmail,
  eventName,
  ticketNumber
) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: "Booking Cancelled ❌",
      html: `
        <h2>Booking Cancelled</h2>

        <p><b>Event:</b> ${eventName}</p>

        <p><b>Ticket Number:</b> ${ticketNumber}</p>

        <p>Your booking has been cancelled successfully.</p>
      `,
    });

    console.log("Cancellation Email Sent");
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  sendBookingEmail,
  sendCancellationEmail,
};