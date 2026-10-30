const express = require("express");
const router = express.Router();

const {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  searchEvents,
  getOrganizerEvents,
} = require("../controllers/eventController");

// Search Events
router.get("/search", searchEvents);

// Create Event
router.post("/create", createEvent);

// Get Organizer Events
router.get(
  "/organizer/:organizerId",
  getOrganizerEvents
);

// Get All Events
router.get("/", getAllEvents);

// Get Single Event
router.get("/:id", getEventById);

// Update Event
router.put("/:id", updateEvent);

// Delete Event
router.delete("/:id", deleteEvent);

module.exports = router;