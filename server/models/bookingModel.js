// const mongoose = require('mongoose');

// const bookingSchema = new mongoose.Schema({
//     pickup_location: {
//         latitude: Number,
//         longitude: Number,
//         address: String
//     },
//     dropoff_location: {
//         latitude: Number,
//         longitude: Number,
//         address: String
//     },
//     user: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User'
//     }
// });

// module.exports = mongoose.model('Booking', bookingSchema);

const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    pickup_location: {
        latitude: Number,
        longitude: Number,
        address: String
    },
    dropoff_location: {
        latitude: Number,
        longitude: Number,
        address: String
    },
    user: {
        type: String, 
        required: true 
    }
});

module.exports = mongoose.model('Booking', bookingSchema);

