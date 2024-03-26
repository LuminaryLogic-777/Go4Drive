// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//     name: String
// });

// module.exports = mongoose.model('User', userSchema);


// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: true,
//         unique: true 
//     },
//     userId: {
//         type: mongoose.Schema.Types.ObjectId,
//         required: true
//     }
// });

// module.exports = mongoose.model('User', userSchema);

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }] 
});

module.exports = mongoose.model('User', userSchema);

