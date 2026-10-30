const Event = require("../models/Event");
const Booking = require("../models/Booking");

const isPastDate = (date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return new Date(`${date}T00:00:00`) < today;
};

const validateEventData = (data, existingEvent = null) => {
  const date = data.date ?? existingEvent?.date;
  const price = Number(data.price ?? existingEvent?.price ?? 0);
  const capacity = Number(
    data.capacity ?? existingEvent?.capacity
  );
  const bookedSeats =
    existingEvent?.bookedSeats?.length || 0;

  if (!date || Number.isNaN(new Date(`${date}T00:00:00`).getTime())) {
    return "Please enter a valid event date";
  }

  if (isPastDate(date)) {
    return "Event date cannot be a past date";
  }

  if (!Number.isFinite(capacity) || capacity <= 0) {
    return "Capacity must be greater than 0";
  }

  if (capacity < bookedSeats) {
    return "Capacity cannot be less than already booked seats";
  }

  if (!Number.isFinite(price) || price < 0) {
    return "Price cannot be negative";
  }

  return null;
};

// Create Event
const createEvent = async (req, res) => {
  try {
    const {
      organizerId,
      eventName,
      category,
      description,
      venue,
      date,
      time,
      price,
      capacity,
      image,
    } = req.body;

    const validationError = validateEventData({
      date,
      price,
      capacity,
    });

    if (validationError) {
      return res.status(400).json({
        message: validationError,
      });
    }

    const event = new Event({
      organizerId,
      eventName: eventName?.trim(),
      category: category?.trim(),
      description: description?.trim(),
      venue: venue?.trim(),
      date,
      time,
      price: Number(price),
      capacity: Number(capacity),
      availableSeats: Number(capacity),
      image,
    });

    await event.save();

    res.status(201).json({
      message: "Event created successfully",
      event,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get All Events
const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find();

    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get Single Event
const getEventById = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update Event
const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { organizerId } = req.query;

    const existingEvent = await Event.findById(id);

    if (!existingEvent) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    const validationError = validateEventData(
      req.body,
      existingEvent
    );

    if (validationError) {
      return res.status(400).json({
        message: validationError,
      });
    }

    const oldCapacity = existingEvent.capacity;
    const nextCapacity =
      req.body.capacity !== undefined
        ? Number(req.body.capacity)
        : existingEvent.capacity;

    const capacityDifference = nextCapacity - oldCapacity;

    const updateData = {
      ...req.body,
      price:
        req.body.price !== undefined
          ? Number(req.body.price)
          : existingEvent.price,
      capacity: nextCapacity,
      availableSeats:
        existingEvent.availableSeats +
        capacityDifference,
    };

    ["eventName", "venue", "category", "description"].forEach(
      (field) => {
        if (typeof updateData[field] === "string") {
          updateData[field] = updateData[field].trim();
        }
      }
    );

    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    res.status(200).json({
      message: "Event updated successfully",
      event: updatedEvent,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete Event
const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { organizerId } = req.query;

    const event = await Event.findById(id);

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
        message: "You cannot delete another organizer's event",
      });
    }

    const bookingCount = await Booking.countDocuments({
      eventId: id,
      status: { $ne: "Cancelled" },
    });

    if (bookingCount > 0) {
      return res.status(400).json({
        message: "Cannot delete event with active bookings",
      });
    }

    await Event.findByIdAndDelete(id);

    res.status(200).json({
      message: "Event deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const searchEvents = async (req, res) => {
  try {
    const { keyword } = req.query;

    const events = await Event.find({
      $or: [
        {
          eventName: {
            $regex: keyword,
            $options: "i",
          },
        },
        {
          category: {
            $regex: keyword,
            $options: "i",
          },
        },
        {
          venue: {
            $regex: keyword,
            $options: "i",
          },
        },
      ],
    });

    res.status(200).json(events);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const getOrganizerEvents = async (req, res) => {
  try {
    const { organizerId } = req.params;

    const events = await Event.find({
      organizerId: organizerId,
    });

    res.status(200).json(events);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  searchEvents,
  getOrganizerEvents,
};
