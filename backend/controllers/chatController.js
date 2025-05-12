const asyncHandler = require('express-async-handler');
const Chat = require('../models/Chat');

// @desc    Get all messages between two users
// @route   GET /api/chat/:senderId/:receiverId
// @access  Private
const getMessages = asyncHandler(async (req, res) => {
  const { senderId, receiverId } = req.params;

  const messages = await Chat.find({
    $or: [
      { sender: senderId, receiver: receiverId },
      { sender: receiverId, receiver: senderId },
    ],
  }).sort({ createdAt: 1 });

  res.json(messages);
});

// @desc    Send a message
// @route   POST /api/chat
// @access  Private
const sendMessage = asyncHandler(async (req, res) => {
  const { sender, receiver, message } = req.body;

  const newMessage = new Chat({
    sender,
    receiver,
    message,
  });

  const savedMessage = await newMessage.save();
  res.status(201).json(savedMessage);
});

module.exports = { getMessages, sendMessage };