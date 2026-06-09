const express = require('express');
const { handleChat, getChatHistory, getChatSessions } = require('../controllers/aiController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/chat/sessions', getChatSessions);
router.get('/chat/history', getChatHistory);
router.post('/chat', handleChat);

module.exports = router;
