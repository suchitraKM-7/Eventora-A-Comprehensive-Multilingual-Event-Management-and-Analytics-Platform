const express = require("express");
const router = express.Router();

const {
  submitFeedback,
  getEventFeedback,
  getOrganizerFeedback,
} = require("../controllers/feedbackController");

router.post("/", submitFeedback);

router.get(
  "/event/:eventId",
  getEventFeedback
);

router.get(
  "/organizer/:organizerId",
  getOrganizerFeedback
);

module.exports = router;
