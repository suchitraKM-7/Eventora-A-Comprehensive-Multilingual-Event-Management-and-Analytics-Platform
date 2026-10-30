const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },

    seatNumber: {
      type: String,
      required: false,
    },

    ticketPrice: {
      type: Number,
      required: true,
    },

    ticketNumber: {
      type: String,
      unique: true,
    },

    bookingDate: {
      type: Date,
      default: Date.now,
    },
    paymentId: {
  type: String,
  default: ""
},

orderId: {
  type: String,
  default: ""
},

    status: {
      type: String,
      default: "Booked",
    },

    attendanceStatus: {
      type: String,
      enum: ["Booked", "Checked-In", "Cancelled"],
      default: "Booked",
    },
  },
  {
    timestamps: true,
  }
);

bookingSchema.index(
  { eventId: 1, seatNumber: 1, status: 1 },
  {
    unique: true,
    partialFilterExpression: { status: "Booked" },
  }
);

bookingSchema.index(
  { userId: 1, eventId: 1, status: 1 },
  {
    unique: true,
    partialFilterExpression: { status: "Booked" },
  }
);

module.exports = mongoose.model(
  "Booking",
  bookingSchema
);
