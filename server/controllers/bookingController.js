const Booking = require("../models/Booking");
const Event = require("../models/Event");
const User = require("../models/User");

const {
  sendBookingEmail,
  sendCancellationEmail,
} = require("../utils/emailService");

// Book Event
const bookEvent = async (req, res) => {
  try {
    const {
  userId,
  eventId,
  seatNumber,
  paymentId,
  orderId
} = req.body;

    const event = await Event.findById(
      eventId
    );

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    if (event.availableSeats <= 0) {
      return res.status(400).json({
        message: "No seats available",
      });
    }

    if (!seatNumber) {
      return res.status(400).json({
        message: "Please select a seat",
      });
    }

    const normalizedSeatNumber = String(
      seatNumber
    ).trim();

    const seatLimit = Number(
      normalizedSeatNumber.replace("S", "")
    );

    if (
      !/^S\d+$/.test(normalizedSeatNumber) ||
      seatLimit < 1 ||
      seatLimit > event.capacity
    ) {
      return res.status(400).json({
        message: "Invalid seat number",
      });
    }

    if (event.bookedSeats.includes(normalizedSeatNumber)) {
      return res.status(400).json({
        message: "Seat already booked",
      });
    }

    const existingBooking =
      await Booking.findOne({
        userId,
        eventId,
        status: "Booked",
      });

    if (existingBooking) {
      return res.status(400).json({
        message:
          "You have already booked this event",
      });
    }

    const ticketNumber =
      "TKT-" +
      new Date().getFullYear() +
      "-" +
      Date.now();

    const updatedEvent = await Event.findOneAndUpdate(
      {
        _id: eventId,
        availableSeats: { $gt: 0 },
        bookedSeats: { $ne: normalizedSeatNumber },
      },
      {
        $push: { bookedSeats: normalizedSeatNumber },
        $inc: { availableSeats: -1 },
      },
      { new: true }
    );

    if (!updatedEvent) {
      return res.status(400).json({
        message: "Seat already booked",
      });
    }

    const booking = new Booking({
  userId,
  eventId,
  seatNumber: normalizedSeatNumber,
  ticketPrice: event.price,
  ticketNumber,
  paymentId,
  orderId,
  status: "Booked",
  attendanceStatus: "Booked",
});

    try {
      await booking.save();
    } catch (error) {
      await Event.findByIdAndUpdate(eventId, {
        $pull: { bookedSeats: normalizedSeatNumber },
        $inc: { availableSeats: 1 },
      });

      if (error.code === 11000) {
        return res.status(400).json({
          message:
            "Seat already booked or booking already exists",
        });
      }

      throw error;
    }

    const user =
      await User.findById(userId);

    if (user) {
      await sendBookingEmail(
        user.email,
        updatedEvent.eventName,
        ticketNumber
      );
    }

    res.status(201).json({
      message:
        "Event booked successfully",
      booking,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
// Get My Bookings
const getMyBookings = async (
  req,
  res
) => {
  try {
    const { userId } = req.params;

    const bookings =
      await Booking.find({
        userId,
      }).populate("eventId");

    res.status(200).json(bookings);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get Ticket By Booking ID
const getTicketById = async (
  req,
  res
) => {
  try {
    const { bookingId } = req.params;

    const booking =
      await Booking.findById(
        bookingId
      ).populate("eventId");

    if (!booking) {
      return res.status(404).json({
        message: "Ticket not found",
      });
    }

    res.status(200).json(booking);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Cancel Booking
const cancelBooking = async (
  req,
  res
) => {
  try {
    const { bookingId } = req.params;

    const booking =
      await Booking.findById(
        bookingId
      );

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    if (
      booking.status ===
      "Cancelled"
    ) {
      return res.status(400).json({
        message:
          "Booking already cancelled",
      });
    }

    const event =
      await Event.findById(
        booking.eventId
      );

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    booking.status = "Cancelled";
    booking.attendanceStatus = "Cancelled";

    await booking.save();

    event.availableSeats += 1;

event.bookedSeats =
  event.bookedSeats.filter(
    (seat) =>
      seat !== booking.seatNumber
  );

await event.save();

    const user =
      await User.findById(
        booking.userId
      );

    if (user) {
      await sendCancellationEmail(
        user.email,
        event.eventName,
        booking.ticketNumber
      );
    }

    res.status(200).json({
      message:
        "Booking cancelled successfully",
      booking,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Verify Ticket By Ticket Number
const verifyTicket = async (req, res) => {
  try {
    const { ticketNumber } = req.body;

    const booking = await Booking.findOne({
      ticketNumber,
    })
      .populate("eventId")
      .populate("userId", "name email");

    if (!booking || booking.status !== "Booked") {
      return res.status(404).json({
        valid: false,
        message: "Invalid Ticket",
      });
    }

    res.status(200).json({
      valid: true,
      message: "Valid Ticket",
      ticketNumber: booking.ticketNumber,
      eventName: booking.eventId?.eventName,
      participantName: booking.userId?.name,
      seatNumber: booking.seatNumber,
      attendanceStatus:
        booking.attendanceStatus || "Booked",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get All Bookings For Organizer Events
const getOrganizerBookings = async (req, res) => {
  try {
    const { organizerId } = req.params;

    const events = await Event.find({
      organizerId,
    });

    const eventIds = events.map(
      (event) => event._id
    );

    const bookings = await Booking.find({
      eventId: {
        $in: eventIds,
      },
    })
      .populate("eventId")
      .populate("userId", "name email");

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get Bookings For One Organizer Event
const getEventBookings = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { organizerId } = req.query;

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    if (
      organizerId &&
      String(event.organizerId) !== String(organizerId)
    ) {
      return res.status(403).json({
        message: "You cannot view another organizer's event bookings",
      });
    }

    const bookings = await Booking.find({
      eventId,
    })
      .populate("eventId")
      .populate("userId", "name email");

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Mark Attendance
const markAttendance = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(
      bookingId
    );

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    if (booking.status === "Cancelled") {
      return res.status(400).json({
        message:
          "Cancelled bookings cannot be checked in",
      });
    }

    booking.attendanceStatus = "Checked-In";
    await booking.save();

    res.status(200).json({
      message: "Attendance marked successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  bookEvent,
  getMyBookings,
  getTicketById,
  cancelBooking,
  verifyTicket,
  getOrganizerBookings,
  getEventBookings,
  markAttendance,
};
