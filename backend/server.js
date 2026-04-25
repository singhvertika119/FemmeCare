require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Connect Database
connectDB();

const app = express();

// Init Middleware
const corsOptions = {
  origin: process.env.FRONTEND_URL || ['http://localhost:5173', 'http://localhost:80'],
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());

// Health Check for Render Sleep Wake
app.get('/api/health', (req, res) => res.status(200).json({ status: 'ok', timestamp: new Date() }));

// Define Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));
app.use('/api/doctors', require('./routes/doctorRoutes'));

app.get('/', (req, res) => res.send('FemmeCare API Running'));

const PORT = process.env.PORT || 5000;

require('./jobs/reminderJob')();
require('./jobs/autoCompleteJob')();

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
