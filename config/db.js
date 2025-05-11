const mysql = require('mysql2');
require('dotenv').config();

const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

const connection = mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
});

connection.connect((err) => {
    if (err) {
        console.error('❌ MySQL connection failed:', err.message);
        process.exit(1);
    }
    console.info('✅ Connected to MySQL (no DB selected)');

    initializeDatabase();
});

function initializeDatabase() {
    const createDBQuery = `CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``;

    connection.query(createDBQuery, (err) => {
        if (err) {
            console.error('❌ Error creating database:', err.message);
            process.exit(1);
        }
        console.info(`✅ Database '${DB_NAME}' ready.`);

        // Switch to the created/selected database
        connection.changeUser({ database: DB_NAME }, (err) => {
            if (err) {
                console.error('❌ Error selecting database:', err.message);
                process.exit(1);
            }
            console.info(`✅ Using database '${DB_NAME}'`);

            createSchoolsTable();
        });
    });
}

function createSchoolsTable() {
    const tableQuery = `
        CREATE TABLE IF NOT EXISTS schools (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            address VARCHAR(255) NOT NULL,
            latitude FLOAT NOT NULL,
            longitude FLOAT NOT NULL
        )
    `;

    connection.query(tableQuery, (err) => {
        if (err) {
            console.error("❌ Error creating 'schools' table:", err.message);
            process.exit(1);
        }
        console.info("✅ Table 'schools' is ready.");
    });
}

module.exports = connection;
