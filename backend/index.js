const express = require('express');
const cors = require('cors');
const connectDB = require('./config/server'); // यह आपकी config/server.js को कॉल करेगा
const authRoutes = require('./routes/authroutes');
const dashboardRoutes = require('./routes/dashboardroutes');
require('dotenv').config();

const app = express();

// Database Connection
(async () => {
  await connectDB();
})();

// Middlewares
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'], // Allow multiple ports
  credentials: true
}));
app.use(express.json());

// Routes Setup
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server started on port ${PORT}`));