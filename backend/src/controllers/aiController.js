const { mockDB } = require('../utils/mockData');
const db = require('../utils/db');

let generateEmbedding = null;
try {
  generateEmbedding = require('../utils/embedder').generateEmbedding;
} catch {
  console.log('[aiController] Embedder unavailable — RAG will be skipped.');
}

/* ───── Mock AI responses when no Groq API key ───── */

const MOCK_RESPONSES = [
  "Great question! 🐾 Based on general pet care guidelines, I'd recommend consulting with your local vet for personalized advice. In the meantime, make sure your pet has fresh water, regular exercise, and a balanced diet!",
  "That's a common concern among pet owners! 🐶 Regular check-ups, proper nutrition, and plenty of love go a long way. Would you like me to share some specific tips about pet nutrition?",
  "I'd love to help with that! 🐱 While every pet is unique, here are some general tips: maintain a consistent feeding schedule, ensure plenty of playtime, and keep vaccinations up to date. Feel free to ask more specific questions!",
  "Thanks for asking! 🐾 Pet health is so important. I recommend keeping a routine for your furry friend — regular walks, balanced meals, and annual vet visits. Let me know if you'd like to dive deeper into any topic!",
  "That's a wonderful question about pet care! 🎾 Remember that mental stimulation is just as important as physical exercise. Puzzle toys, training sessions, and social interaction all contribute to a happy, healthy pet!",
  "I'm glad you're thinking about this! 🐕 Good dental hygiene, regular grooming, and age-appropriate exercise are key components of pet wellness. Would you like specific recommendations for your pet's breed?",
];

function getMockReply(message) {
  const idx = Math.abs(message.split('').reduce((a, c) => a + c.charCodeAt(0), 0)) % MOCK_RESPONSES.length;
  return MOCK_RESPONSES[idx];
}

/* ───── Controllers ───── */

async function getChatSessions(req, res) {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized request.' });
    }

    let sessions;
    if (process.env.DATABASE_URL) {
      try {
        const result = await db.query(
          'SELECT DISTINCT "sessionId", message FROM "ChatHistory" WHERE "userId" = $1 AND role = \'user\' ORDER BY "createdAt" DESC',
          [userId]
        );
        sessions = result.rows.map((s) => ({
          sessionId: s.sessionId,
          title: s.message,
        }));
      } catch {
        sessions = mockDB.getChatSessions(userId);
      }
    } else {
      sessions = mockDB.getChatSessions(userId);
    }

    return res.status(200).json({ sessions });
  } catch (error) {
    return res.status(500).json({
      error: 'Failed to fetch sessions.',
      details: error.message,
    });
  }
}

async function getChatHistory(req, res) {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized request.' });
    }

    let history;
    if (process.env.DATABASE_URL) {
      try {
        const result = await db.query(
          'SELECT "sessionId", role, message FROM "ChatHistory" WHERE "userId" = $1 ORDER BY "createdAt" ASC',
          [userId]
        );
        history = result.rows.map((msg) => ({
          sessionId: msg.sessionId,
          role: msg.role === 'user' ? 'user' : 'bot',
          text: msg.message,
        }));
      } catch {
        history = mockDB.getChatHistory(userId);
      }
    } else {
      history = mockDB.getChatHistory(userId);
    }

    return res.status(200).json({ history });
  } catch (error) {
    return res.status(500).json({
      error: 'Failed to fetch chat history.',
      details: error.message,
    });
  }
}

async function handleChat(req, res) {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized request.' });
    }

    const { message, sessionId } = req.body;
    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'A valid message is required.' });
    }
    if (!sessionId) {
      return res.status(400).json({ error: 'A valid sessionId is required.' });
    }

    const apiKey = process.env.GROQ_API_KEY;
    console.log('[AI] GROQ_API_KEY present:', !!apiKey);

    /* ── No Groq key → return mock response ── */
    if (!apiKey) {
      const reply = getMockReply(message);
      mockDB.addChatMessages([
        { userId, sessionId, role: 'user', message: message.trim() },
        { userId, sessionId, role: 'assistant', message: reply },
      ]);
      return res.status(200).json({ reply, sessionId });
    }

    /* ── Real Groq API via native fetch ── */
    let userPetsStr = 'No pets added yet';
    try {
      const mockPets = mockDB.getPetsByUser(userId);
      if (mockPets.length) {
        userPetsStr = mockPets.map(p => p.name + ' (' + p.breed + ')').join(', ');
      }
    } catch {}

    const systemPrompt = {
      role: 'system',
      content: `You are Cuddles, a friendly and expert pet care AI assistant for PetSphere. The user's pets are: [${userPetsStr}]. Answer questions about pet health, nutrition, grooming, and care. Provide grooming recommendations based on the pet's breed when relevant. Be warm, helpful, and concise.`,
    };

    const finalMessages = [systemPrompt, { role: 'user', content: message.trim() }];

    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: finalMessages,
        temperature: 0.7,
      }),
    });

    if (!groqResponse.ok) {
      const errBody = await groqResponse.text();
      throw new Error(`Groq API error ${groqResponse.status}: ${errBody}`);
    }

    const groqData = await groqResponse.json();
    const reply = groqData?.choices?.[0]?.message?.content?.trim();

    if (!reply) {
      throw new Error('Groq returned an empty response.');
    }

    // Save to DB (async, non-blocking)
    if (process.env.DATABASE_URL) {
      db.query(
        'INSERT INTO "ChatHistory" ("id", "userId", "sessionId", role, message, "createdAt") VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW()), (gen_random_uuid(), $5, $6, $7, $8, NOW())',
        [userId, sessionId, 'user', message.trim(), userId, sessionId, 'assistant', reply]
      ).catch(err => console.error("Failed to save chat history:", err.message));
    } else {
      mockDB.addChatMessages([
        { userId, sessionId, role: 'user', message: message.trim() },
        { userId, sessionId, role: 'assistant', message: reply },
      ]);
    }

    return res.status(200).json({ reply, sessionId });
  } catch (error) {
    return res.status(500).json({
      error: 'Failed to get response from AI.',
      details: error.message,
    });
  }
}

module.exports = {
  handleChat,
  getChatHistory,
  getChatSessions,
};
