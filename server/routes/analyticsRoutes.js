const express = require("express");
const router = express.Router();

const {
  getAnalytics,
  getOrganizerAnalytics,
  getEventAnalytics,
  getAdminDashboard,
  getAdminFullAnalytics
} = require(
 "../controllers/analyticsController"
);

router.get("/admin-dashboard", getAdminDashboard);
router.get(
  "/admin-full",
  getAdminFullAnalytics
);

router.get("/event/:eventId", getEventAnalytics);

// Global Analytics
router.get("/", getAnalytics);

// Organizer Analytics
router.get(
  "/organizer/:organizerId",
  getOrganizerAnalytics
);

module.exports = router;
