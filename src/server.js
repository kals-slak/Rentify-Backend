const express = require('express');
const connectDB = require('./utils/dbConn');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/user.routes');
const propertyRoutes = require('./routes/property.routes');
const { authenticate } = require('./middlewares/auth');

const app = express();
require('dotenv').config()

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/properties', authenticate, propertyRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
