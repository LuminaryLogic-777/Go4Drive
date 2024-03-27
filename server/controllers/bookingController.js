const Booking = require('../models/bookingModel');
const User = require('../models/userModel');
const addressData = require('../data/address.json');

const findCoordinates = (address) => {
    const location = addressData.addresses.find(item => item.address === address);
    if (!location) {
        throw new Error(`Address "${address}" not found in the database.`);
    }
    return { latitude: location.latitude, longitude: location.longitude };
};

exports.createBooking = async (req, res) => {
    try {
        const { pickup_address, dropoff_address, user } = req.body;
        const pickupCoordinates = findCoordinates(pickup_address);
        const dropoffCoordinates = findCoordinates(dropoff_address);
        let existingUser = await User.findOne({ name: user });
        if (!existingUser) {
            existingUser = await User.create({ name: user, bookings: [] });
        }
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
            user: existingUser._id
        });

        // Save the new booking
        const savedBooking = await newBooking.save();
        existingUser.bookings.push(savedBooking._id);
        await existingUser.save();

        res.status(201).json(savedBooking);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
    