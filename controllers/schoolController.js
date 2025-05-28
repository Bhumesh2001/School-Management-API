const getConnection = require('../config/db');
const { calculateDistance } = require('../utils/util');

// Add School
exports.addSchool = async (req, res) => {
    const { name, address, latitude, longitude } = req.body;

    if (!name || !address || !latitude || !longitude) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        const conn = await getConnection();

        // Check if the school already exists
        const checkSQL = `
            SELECT 1 FROM schools 
            WHERE name = ? AND address = ? AND latitude = ? AND longitude = ?
            LIMIT 1
        `;
        const [existing] = await conn.query(checkSQL, [name, address, latitude, longitude]);

        if (existing.length > 0) {
            return res.status(409).json({ message: 'This school already exists.' });
        }

        // Insert the new school
        const insertSQL = `
            INSERT INTO schools (name, address, latitude, longitude) 
            VALUES (?, ?, ?, ?)
        `;
        const [result] = await conn.query(insertSQL, [name, address, latitude, longitude]);

        res.status(201).json({ message: 'School added successfully', id: result.insertId });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// List Schools with Distance from a given lat/lon
exports.listSchools = async (req, res) => {
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
        return res.status(400).json({ message: 'Latitude and longitude are required.' });
    }

    try {
        const conn = await getConnection();
        const [results] = await conn.query('SELECT * FROM schools');

        const userLat = parseFloat(latitude);
        const userLong = parseFloat(longitude);

        const schoolsWithDistance = results.map((school) => {
            const distance = calculateDistance(userLat, userLong, school.latitude, school.longitude);
            return { ...school, distance: parseFloat(distance.toFixed(2)) };
        });

        schoolsWithDistance.sort((a, b) => a.distance - b.distance);

        res.json(schoolsWithDistance);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
