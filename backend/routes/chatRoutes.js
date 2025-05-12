const express = require('express');
const { protect } = require('../middleware/auth');
const { getMessages, sendMessage } = require('../controllers/chatController');

const router = express.Router();

router.route('/:senderId/:receiverId').get(protect, getMessages);
router.route('/').post(protect, sendMessage);

module.exports = router;