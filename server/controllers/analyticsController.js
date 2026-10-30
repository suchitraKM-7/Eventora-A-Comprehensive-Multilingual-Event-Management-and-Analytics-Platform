const Booking = require("../models/Booking");
const Event = require("../models/Event");
const Feedback = require("../models/Feedback");
const User = require("../models/User");

// Global Analytics
const getAnalytics = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("eventId");

    const events = await Event.find();
    const feedback = await Feedback.find();

    const totalBookings = bookings.length;
    const ticketsSold = bookings.filter(
      (booking) => booking.status !== "Cancelled"
    ).length;

    const activeBookings = bookings.filter(
      (booking) => booking.status === "Booked"
    ).length;

    const cancelledBookings = bookings.filter(
      (booking) => booking.status === "Cancelled"
    ).length;

    let grossRevenue = 0;
    let refundedRevenue = 0;

    const eventAnalytics = {};

    bookings.forEach((booking) => {
      const price = booking.ticketPrice || 0;

      grossRevenue += price;

      if (booking.status === "Cancelled") {
        refundedRevenue += price;
      }

      if (booking.eventId) {
        const eventName =
          booking.eventId.eventName;

        if (!eventAnalytics[eventName]) {
          eventAnalytics[eventName] = {
            grossRevenue: 0,
            refundedRevenue: 0,
            netRevenue: 0,
            bookings: 0,
            ticketsSold: 0,
          };
        }

        eventAnalytics[eventName].grossRevenue +=
          price;

        if (booking.status === "Cancelled") {
          eventAnalytics[eventName]
            .refundedRevenue += price;
        }

        eventAnalytics[eventName].bookings += 1;

        if (booking.status !== "Cancelled") {
          eventAnalytics[eventName].ticketsSold += 1;
        }
      }
    });

    const netRevenue =
      grossRevenue - refundedRevenue;

    Object.keys(eventAnalytics).forEach(
      (eventName) => {
        eventAnalytics[eventName].netRevenue =
          eventAnalytics[eventName]
            .grossRevenue -
          eventAnalytics[eventName]
            .refundedRevenue;
      }
    );

    const averageTicketPrice =
      activeBookings > 0
        ? netRevenue / activeBookings
        : 0;

    let topPerformingEvent = null;
    let highestRevenue = 0;
    let mostPopularEvent = null;
    let mostTicketsSold = 0;

    Object.keys(eventAnalytics).forEach(
      (eventName) => {
        if (
          eventAnalytics[eventName]
            .netRevenue > highestRevenue
        ) {
          highestRevenue =
            eventAnalytics[eventName]
              .netRevenue;

          topPerformingEvent = eventName;
        }

        if (
          eventAnalytics[eventName]
            .ticketsSold > mostTicketsSold
        ) {
          mostTicketsSold =
            eventAnalytics[eventName]
              .ticketsSold;

          mostPopularEvent = eventName;
        }
      }
    );

    const totalCapacity = events.reduce(
      (sum, event) => sum + (event.capacity || 0),
      0
    );

    const occupancyPercentage =
      totalCapacity > 0
        ? (ticketsSold / totalCapacity) * 100
        : 0;

    const averageRating =
      feedback.length > 0
        ? feedback.reduce(
            (sum, item) => sum + item.rating,
            0
          ) / feedback.length
        : 0;

    res.status(200).json({
      grossRevenue,
      refundedRevenue,
      netRevenue,
      totalBookings,
      activeBookings,
      cancelledBookings,
      ticketsSold,
      occupancyPercentage,
      averageRating,
      averageTicketPrice,
      topPerformingEvent,
      highestRevenueEvent: topPerformingEvent,
      mostPopularEvent,
      revenuePerEvent: eventAnalytics,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Organizer Analytics
const getOrganizerAnalytics = async (
  req,
  res
) => {
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
    }).populate("eventId");

    const feedback = await Feedback.find({
      eventId: {
        $in: eventIds,
      },
    });

    const totalEvents = events.length;

    const totalBookings = bookings.filter(
      (booking) =>
        booking.status !== "Cancelled"
    ).length;
    const ticketsSold = totalBookings;

    const activeBookings = bookings.filter(
      (booking) =>
        booking.status === "Booked"
    ).length;

    const cancelledBookings =
      bookings.filter(
        (booking) =>
          booking.status === "Cancelled"
      ).length;

    let grossRevenue = 0;
    let refundedRevenue = 0;

    bookings.forEach((booking) => {
      const price =
        booking.ticketPrice || 0;

      grossRevenue += price;

      if (
        booking.status === "Cancelled"
      ) {
        refundedRevenue += price;
      }
    });

    const netRevenue =
      grossRevenue - refundedRevenue;

    const averageTicketPrice =
      activeBookings > 0
        ? netRevenue / activeBookings
        : 0;

    const totalCapacity = events.reduce(
      (sum, event) => sum + (event.capacity || 0),
      0
    );

    const occupancyPercentage =
      totalCapacity > 0
        ? (ticketsSold / totalCapacity) * 100
        : 0;

    const averageRating =
      feedback.length > 0
        ? feedback.reduce(
            (sum, item) => sum + item.rating,
            0
          ) / feedback.length
        : 0;

    const checkedInBookings = bookings.filter(
      (booking) =>
        booking.status !== "Cancelled" &&
        booking.attendanceStatus === "Checked-In"
    ).length;

    const attendancePercentage =
      totalBookings > 0
        ? (checkedInBookings / totalBookings) * 100
        : 0;

    const ticketsPerEvent = {};
    const revenuePerEvent = {};

    bookings.forEach((booking) => {
      if (!booking.eventId || booking.status === "Cancelled") {
        return;
      }

      const eventName = booking.eventId.eventName;

      ticketsPerEvent[eventName] =
        (ticketsPerEvent[eventName] || 0) + 1;
      revenuePerEvent[eventName] =
        (revenuePerEvent[eventName] || 0) +
        (booking.ticketPrice || 0);
    });

    let mostPopularEvent = null;
    let mostTicketsSold = 0;
    let highestRevenueEvent = null;
    let highestRevenue = 0;

    Object.keys(ticketsPerEvent).forEach(
      (eventName) => {
        if (ticketsPerEvent[eventName] > mostTicketsSold) {
          mostTicketsSold = ticketsPerEvent[eventName];
          mostPopularEvent = eventName;
        }
      }
    );

    Object.keys(revenuePerEvent).forEach((eventName) => {
      if (revenuePerEvent[eventName] > highestRevenue) {
        highestRevenue = revenuePerEvent[eventName];
        highestRevenueEvent = eventName;
      }
    });

    res.status(200).json({
      totalEvents,
      totalBookings,
      totalRevenue: netRevenue,
      activeBookings,
      cancelledBookings,
      ticketsSold,
      occupancyPercentage,
      attendancePercentage,
      averageRating,
      mostPopularEvent,
      highestRevenueEvent,
      grossRevenue,
      refundedRevenue,
      netRevenue,
      averageTicketPrice,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Single Event Analytics
const getEventAnalytics = async (req, res) => {
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
        message: "You cannot view another organizer's event analytics",
      });
    }

    const bookings = await Booking.find({
      eventId,
    });

    const activeBookings = bookings.filter(
      (booking) => booking.status !== "Cancelled"
    );

    const checkedInBookings = activeBookings.filter(
      (booking) => booking.attendanceStatus === "Checked-In"
    );

    const feedback = await Feedback.find({
      eventId,
    });

    const revenue = activeBookings.reduce(
      (sum, booking) => sum + (booking.ticketPrice || 0),
      0
    );

    const occupancyPercentage =
      event.capacity > 0
        ? (activeBookings.length / event.capacity) * 100
        : 0;

    const attendancePercentage =
      activeBookings.length > 0
        ? (checkedInBookings.length / activeBookings.length) * 100
        : 0;

    const averageRating =
      feedback.length > 0
        ? feedback.reduce((sum, item) => sum + item.rating, 0) /
          feedback.length
        : 0;

    res.status(200).json({
      eventId: event._id,
      eventName: event.eventName,
      revenue,
      totalBookings: activeBookings.length,
      bookings: activeBookings.length,
      attendanceCount: checkedInBookings.length,
      attendance: checkedInBookings.length,
      attendancePercentage,
      occupancyPercentage,
      averageRating,
      availableSeats: event.availableSeats,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getAdminDashboard = async (req, res) => {
  try {
    const users = await User.find().select("name email role language");
    const events = await Event.find().populate("organizerId", "name email");
    const bookings = await Booking.find().populate("eventId");

    const totalUsers = users.length;
    const totalOrganizers = users.filter(
      (user) => user.role === "organizer"
    ).length;
    const totalParticipants = users.filter(
      (user) => user.role === "participant"
    ).length;
    const totalEvents = events.length;
    const totalBookings = bookings.length;

    const activeBookings = bookings.filter(
      (booking) => booking.status !== "Cancelled"
    );

    const totalRevenue = activeBookings.reduce(
      (sum, booking) => sum + (booking.ticketPrice || 0),
      0
    );

    const organizerStats = users
      .filter((user) => user.role === "organizer")
      .map((organizer) => {
        const organizerEvents = events.filter(
          (event) =>
            String(event.organizerId?._id || event.organizerId) ===
            String(organizer._id)
        );

        const organizerEventIds = organizerEvents.map((event) =>
          String(event._id)
        );

        const organizerRevenue = activeBookings
          .filter((booking) =>
            organizerEventIds.includes(String(booking.eventId?._id))
          )
          .reduce(
            (sum, booking) => sum + (booking.ticketPrice || 0),
            0
          );

        return {
          _id: organizer._id,
          name: organizer.name,
          totalEvents: organizerEvents.length,
          totalRevenue: organizerRevenue,
        };
      });

    const eventStats = events.map((event) => ({
      _id: event._id,
      eventName: event.eventName,
      organizerName: event.organizerId?.name || "N/A",
      date: event.date,
      bookings: bookings.filter(
        (booking) =>
          String(booking.eventId?._id) === String(event._id)
      ).length,
    }));

    const ticketsPerEvent = {};

    activeBookings.forEach((booking) => {
      const eventName = booking.eventId?.eventName;

      if (!eventName) return;

      ticketsPerEvent[eventName] =
        (ticketsPerEvent[eventName] || 0) + 1;
    });

    let mostPopularEvent = null;
    let mostTicketsSold = 0;

    Object.keys(ticketsPerEvent).forEach((eventName) => {
      if (ticketsPerEvent[eventName] > mostTicketsSold) {
        mostTicketsSold = ticketsPerEvent[eventName];
        mostPopularEvent = eventName;
      }
    });

    const topOrganizer =
      organizerStats.reduce(
        (top, organizer) =>
          !top || organizer.totalRevenue > top.totalRevenue
            ? organizer
            : top,
        null
      )?.name || null;

    res.status(200).json({
      cards: {
        totalUsers,
        totalOrganizers,
        totalParticipants,
        totalEvents,
        totalBookings,
        totalRevenue,
        mostPopularEvent,
        topOrganizer,
      },
      users,
      organizers: organizerStats,
      events: eventStats,
      platformAnalytics: {
        totalRevenue,
        totalBookings,
        mostPopularEvent,
        topOrganizer,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const getAdminFullAnalytics = async (req, res) => {
  try {

    const users = await User.find();

    const events = await Event.find()
      .populate("organizerId", "name");

    const bookings = await Booking.find()
  .populate("userId", "name")
  .populate({
    path: "eventId",
    populate: {
      path: "organizerId",
      select: "name"
    }
  });

    const now = new Date();

    const todayStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );

    const weekStart = new Date(todayStart);
    weekStart.setDate(
      todayStart.getDate() - 7
    );

    const monthStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    );

    const yearStart = new Date(
      now.getFullYear(),
      0,
      1
    );

    const dailyUsers =
      users.filter(
        u => u.createdAt >= todayStart
      ).length;

    const weeklyUsers =
      users.filter(
        u => u.createdAt >= weekStart
      ).length;

    const monthlyUsers =
      users.filter(
        u => u.createdAt >= monthStart
      ).length;

    const yearlyUsers =
      users.filter(
        u => u.createdAt >= yearStart
      ).length;

    const dailyEvents =
      events.filter(
        e => e.createdAt >= todayStart
      ).length;

    const weeklyEvents =
      events.filter(
        e => e.createdAt >= weekStart
      ).length;

    const monthlyEvents =
      events.filter(
        e => e.createdAt >= monthStart
      ).length;

    const yearlyEvents =
      events.filter(
        e => e.createdAt >= yearStart
      ).length;

    const activeBookings =
      bookings.filter(
        b => b.status !== "Cancelled"
      );

    const revenueFor = (list) =>
      list.reduce(
        (sum, b) =>
          sum + (b.ticketPrice || 0),
        0
      );

    const dailyBookings =
      activeBookings.filter(
        b => b.createdAt >= todayStart
      );
      const dailyActiveUsers =
  new Set(
    dailyBookings.map(
      b => String(b.userId?._id || b.userId)
    )
  ).size;

    const weeklyBookings =
      activeBookings.filter(
        b => b.createdAt >= weekStart
      );
      const weeklyActiveUsers =
  new Set(
    weeklyBookings.map(
      b => String(b.userId?._id || b.userId)
    )
  ).size;
      const weeklyBookingUsers =
  [...new Set(
    weeklyBookings.map(
      b => b.userId?.name
    )
  )];

console.log(
  "Weekly Users:",
  weeklyBookingUsers
);

    const monthlyBookings =
      activeBookings.filter(
        b => b.createdAt >= monthStart
      );
      const monthlyActiveUsers =
  new Set(
    monthlyBookings.map(
      b => String(b.userId?._id || b.userId)
    )
  ).size;

    const yearlyBookings =
      activeBookings.filter(
        b => b.createdAt >= yearStart
      );
      const yearlyActiveUsers =
  new Set(
    yearlyBookings.map(
      b => String(b.userId?._id || b.userId)
    )
  ).size;

    const eventAnalytics =
      events.map(event => {

        const eventBookings =
          activeBookings.filter(
            b =>
              String(
                b.eventId?._id
              ) ===
              String(event._id)
          );

       return {

  eventName: event.eventName,

  organizer:
    event.organizerId?.name || "N/A",
eventDate: event.date,
  totalSeats:
    event.capacity,

  availableSeats:
    event.availableSeats,

  bookedSeats:
    event.capacity -
    event.availableSeats,

  bookings:
    eventBookings.length,

  revenue:
    revenueFor(eventBookings),

  avgRevenuePerBooking:
    eventBookings.length > 0
      ? (
          revenueFor(eventBookings) /
          eventBookings.length
        ).toFixed(2)
      : 0

};
      });

  const organizerMap = {};

// Count events created by each organizer
events.forEach(event => {

  const organizer = event.organizerId;

  if (!organizer) return;

  const id = organizer._id.toString();

  if (!organizerMap[id]) {
    organizerMap[id] = {
      name: organizer.name,
      eventsCreated: 0,
      bookings: 0,
      revenue: 0
    };
  }

  organizerMap[id].eventsCreated += 1;
});

// Count bookings and revenue
activeBookings.forEach(booking => {

  const organizer =
    booking.eventId?.organizerId;

  if (!organizer) return;

  const id = organizer._id.toString();

  if (!organizerMap[id]) {
    organizerMap[id] = {
  name: organizer.name,
  eventsCreated: 0,
  bookings: 0,
  revenue: 0,
  avgRevenuePerEvent: 0,
  avgBookingsPerEvent: 0
};
  }

  organizerMap[id].bookings += 1;
  organizerMap[id].revenue += booking.ticketPrice || 0;
});

   const organizerAnalytics =
  Object.values(organizerMap).map(org => ({
    ...org,

    avgRevenuePerEvent:
      org.eventsCreated > 0
        ? (
            org.revenue /
            org.eventsCreated
          ).toFixed(2)
        : 0,

    avgBookingsPerEvent:
      org.eventsCreated > 0
        ? (
            org.bookings /
            org.eventsCreated
          ).toFixed(2)
        : 0
  }));
    const bookingReports =
  activeBookings.map(
    booking => ({
      bookingDate:
        booking.createdAt,

      userName:
        booking.userId?.name ||
        "N/A",

      eventName:
        booking.eventId?.eventName ||
        "N/A",

      organizerName:
        booking.eventId
          ?.organizerId?.name ||
        "N/A",

      amount:
        booking.ticketPrice || 0
    })
  );
    res.json({
      summary: {
        dailyUsers,
        weeklyUsers,
        monthlyUsers,
        yearlyUsers,

        dailyActiveUsers,
        weeklyActiveUsers,
        monthlyActiveUsers,
        yearlyActiveUsers,

        dailyEvents,
        weeklyEvents,
        monthlyEvents,
        yearlyEvents,

        dailyBookings:
          dailyBookings.length,

        weeklyBookings:
          weeklyBookings.length,

        monthlyBookings:
          monthlyBookings.length,

        yearlyBookings:
          yearlyBookings.length,

        dailyRevenue:
          revenueFor(
            dailyBookings
          ),

        weeklyRevenue:
          revenueFor(
            weeklyBookings
          ),

        monthlyRevenue:
          revenueFor(
            monthlyBookings
          ),

        yearlyRevenue:
          revenueFor(
            yearlyBookings
          )
      },

      eventAnalytics,

      organizerAnalytics,

      bookingReports
    });

  } catch (error) {

    res.status(500).json({
      message:
        error.message
    });

  }
};
module.exports = {
  getAnalytics,
  getOrganizerAnalytics,
  getEventAnalytics,
  getAdminDashboard,
  getAdminFullAnalytics
};
