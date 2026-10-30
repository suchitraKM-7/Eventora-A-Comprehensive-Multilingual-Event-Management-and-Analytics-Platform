const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  deleteUser,
} = require("../controllers/authController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.delete("/users/:id", deleteUser);
module.exports = router;