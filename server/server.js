const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bookingRoutes = require('./routes/bookingRoutes');
const userRoutes = require('./routes/userRoutes');
const coordinates=require('./routes/coordinatesRoutes');
const cors=require('cors');

const app = express();
const PORT = process.env.PORT || 5050;

// Middleware
app.use(bodyParser.json());

const corsOptions = {
    origin: 'http://localhost:3000',
}
app.use(cors(corsOptions));

mongoose.connect(process.env.DB_CONNECTION_PATH||'mongodb://localhost/booking-system', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB', err));

// Routes
app.use('/api/bookings', bookingRoutes);
app.use('/api/users', userRoutes);
app.use('/api/getUsers', userRoutes);
app.use('/api/coordinates',coordinates);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
