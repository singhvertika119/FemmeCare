require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Connect Database
connectDB();

const app = express();

// Init Middleware
app.use(cors());
app.use(express.json());

// Define Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));

app.get('/', (req, res) => res.send('FemmeCare API Running'));

const PORT = process.env.PORT || 5000;

require('./jobs/reminderJob')();

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
