const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth.js'));
app.use('/api/survey', require('./routes/survey.js'));
app.use('/api/tasks', require('./routes/tasks.js'));
app.use('/api/schedule', require('./routes/schedule.js'));

mongoose.connect(process.env.MONGODB_URI)

.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});