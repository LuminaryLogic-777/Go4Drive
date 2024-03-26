

// const Booking = require('../models/bookingModel');
// const addressData = require('../data/address.json');

// // Function to find latitude and longitude for a given address
// const findCoordinates = (address) => {
//     const location = addressData.addresses.find(item => item.address === address);
//     if (!location) {
//         throw new Error(`Address "${address}" not found in the database.`);
//     }
//     return { latitude: location.latitude, longitude: location.longitude };
// };

// // Create a new booking
// exports.createBooking = async (req, res) => {
//     try {
//         const { pickup_address, dropoff_address, username } = req.body;

//         // Find latitude and longitude for pickup and dropoff addresses
//         const pickupCoordinates = findCoordinates(pickup_address);
//         const dropoffCoordinates = findCoordinates(dropoff_address);

//         // Create booking with obtained coordinates and username
//         const newBooking = new Booking({
//             pickup_location: {
//                 latitude: pickupCoordinates.latitude,
//                 longitude: pickupCoordinates.longitude,
//                 address: pickup_address
//             },
//             dropoff_location: {
//                 latitude: dropoffCoordinates.latitude,
//                 longitude: dropoffCoordinates.longitude,
//                 address: dropoff_address
//             },
//             user:  username
//         });

//         const savedBooking = await newBooking.save();

//         res.status(201).json(savedBooking);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

const Booking = require('../models/bookingModel');
const User = require('../models/userModel');
const addressData = require('../data/address.json');

// Function to find latitude and longitude for a given address
const findCoordinates = (address) => {
    const location = addressData.addresses.find(item => item.address === address);
    if (!location) {
        throw new Error(`Address "${address}" not found in the database.`);
    }
    return { latitude: location.latitude, longitude: location.longitude };
};

// Create a new booking
exports.createBooking = async (req, res) => {
    try {
        const { pickup_address, dropoff_address, user } = req.body;

        // Find latitude and longitude for pickup and dropoff addresses
        const pickupCoordinates = findCoordinates(pickup_address);
        const dropoffCoordinates = findCoordinates(dropoff_address);

        // Find or create the user in the User schema
        let existingUser = await User.findOne({ name: user });
        if (!existingUser) {
            // Create a new user and store the booking ID
            existingUser = await User.create({ name: user, bookings: [] });
        }

        // Create the booking
        const newBooking = new Booking({
            pickup_location: {
                latitude: pickupCoordinates.latitude,
                longitude: pickupCoordinates.longitude,
                address: pickup_address
            },
            dropoff_location: {
                latitude: dropoffCoordinates.latitude,
                longitude: dropoffCoordinates.longitude,
                address: dropoff_address
            },
            user: existingUser._id // Store the user's ID in the booking
        });

        // Save the new booking
        const savedBooking = await newBooking.save();

        // Update the user document to include a reference to the new booking
        existingUser.bookings.push(savedBooking._id);
        await existingUser.save();

        res.status(201).json(savedBooking);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
    