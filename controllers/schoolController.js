const db = require('../config/db');

// Utility to calculate distance using Haversine formula
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (deg) => deg * (Math.PI / 180);
    const R = 6371; // Radius of the Earth in kilometers

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

exports.addSchool = (req, res) => {
    const { name, address, latitude, longitude } = req.body;

    if (!name || !address || !latitude || !longitude) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    // Check if the school already exists in the database
    const checkSQL = 'SELECT * FROM schools WHERE name = ? AND address = ? AND latitude = ? AND longitude = ?';
    db.query(checkSQL, [name, address, latitude, longitude], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        // If a school already exists, return an error message
        if (results.length > 0) {
            return res.status(409).json({ message: 'This school already exists.' });
        }

        // If no duplicate, proceed with adding the school
        const sql = 'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)';
        db.query(sql, [name, address, latitude, longitude], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ message: 'School added successfully', id: result.insertId });
        });
    });
};

exports.listSchools = (req, res) => {
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
        return res.status(400).json({ message: 'Latitude and longitude are required.' });
    }

    db.query('SELECT * FROM schools', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        const userLat = parseFloat(latitude);
        const userLong = parseFloat(longitude);

        const schoolsWithDistance = results.map((school) => {
            const distance = calculateDistance(userLat, userLong, school.latitude, school.longitude);
            return { ...school, distance: parseFloat(distance.toFixed(2)) };
        });

        schoolsWithDistance.sort((a, b) => a.distance - b.distance);

        res.json(schoolsWithDistance);
    });
};
