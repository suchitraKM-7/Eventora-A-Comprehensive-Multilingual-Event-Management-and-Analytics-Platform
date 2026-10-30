const express = require("express");
const router = express.Router();

const {
bookEvent,
getMyBookings,
getTicketById,
cancelBooking,
verifyTicket,
getOrganizerBookings,
getEventBookings,
markAttendance,
} = require("../controllers/bookingController");

router.post("/book", bookEvent);

router.post(
"/verify-ticket",
verifyTicket
);

router.get(
"/organizer/:organizerId",
getOrganizerBookings
);

router.get(
"/event/:eventId",
getEventBookings
);

router.get(
"/ticket/:bookingId",
getTicketById
);

router.put(
"/attendance/:bookingId",
markAttendance
);

router.put(
"/cancel/:bookingId",
cancelBooking
);

router.get(
"/:userId",
getMyBookings
);

module.exports = router;
