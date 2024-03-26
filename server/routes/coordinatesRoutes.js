const express = require('express');
const router = express.Router();
const addressData = require('../data/address.json');

router.post('/', (req, res) => {
    const { pickup_address, dropoff_address } = req.body;
    const findCoordinates = (address) => {
        const location = addressData.addresses.find(item => item.address === address);
        if (!location) {
            throw new Error(`Address "${address}" not found in the database.`);
        }
        return { latitude: location.latitude, longitude: location.longitude };
    };

    try {
        const pickupCoordinates = findCoordinates(pickup_address);
        const dropoffCoordinates = findCoordinates(dropoff_address);

        res.json({
            pickup_coordinates: pickupCoordinates,
            dropoff_coordinates: dropoffCoordinates
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
