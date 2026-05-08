const express = require("express");

const {
  handleChatRequest
} = require("../controllers/chatController");

const router = express.Router();

/**
 * ASK MODE CHAT
 */
router.post("/", handleChatRequest);

module.exports = router;
