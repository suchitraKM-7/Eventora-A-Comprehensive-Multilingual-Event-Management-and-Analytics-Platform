const Feedback = require("../models/Feedback");
const Event = require("../models/Event");

const submitFeedback = async (req, res) => {
  try {
    const { userId, eventId, rating, comment } = req.body;

    const existingFeedback = await Feedback.findOne({
      userId,
      eventId,
    });

    if (existingFeedback) {
      return res.status(400).json({
        message: "Feedback already submitted for this event",
      });
    }

    const feedback = new Feedback({
      userId,
      eventId,
      rating,
      comment,
    });

    await feedback.save();

    res.status(200).json({
      message: "Feedback submitted successfully",
      feedback,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Feedback already submitted for this event",
      });
    }

    res.status(500).json({
      message: error.message,
    });
  }
};

const getEventFeedback = async (req, res) => {
  try {
    const { eventId } = req.params;

    const feedback = await Feedback.find({
      eventId,
    }).populate("userId", "name email");

    res.status(200).json(feedback);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getOrganizerFeedback = async (req, res) => {
  try {
    const { organizerId } = req.params;

    const events = await Event.find({
      organizerId,
    }).select("_id");

    const eventIds = events.map((event) => event._id);

    const feedback = await Feedback.find({
      eventId: { $in: eventIds },
    })
      .populate("userId", "name email")
      .populate("eventId", "eventName");

    res.status(200).json(feedback);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  submitFeedback,
  getEventFeedback,
  getOrganizerFeedback,
};
