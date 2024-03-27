const fs = require('fs');
const path = require('path');

// Function to read address data from address.json
const readAddressData = () => {
    try {
        const addressFilePath = path.join(__dirname, '..', 'data', 'address.json');
        const addressData = fs.readFileSync(addressFilePath, 'utf8');
        
        return JSON.parse(addressData);
    } catch (err) {
        console.error('Error reading address.json:', err);
        return null;
    }
};

module.exports = { readAddressData };
