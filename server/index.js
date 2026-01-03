const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const contactsRouter = require('./routes/contacts');

const app = express();

const allowedOrigin = process.env.CLIENT_URL || process.env.VITE_API_BASE_URL;

app.use(
  cors({
    origin: allowedOrigin || true,
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
    optionsSuccessStatus: 200,
  })
);
app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api/contacts', contactsRouter);

const PORT = process.env.PORT || 5000;

const MONGO_URI = process.env.MONGO_URI;

async function startServer() {
  if (!MONGO_URI) {
    console.error('Missing MONGO_URI in environment variables');
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected');

    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
}

startServer();
