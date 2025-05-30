const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const initDB = require('./config/db');
const schoolRoutes = require('./routes/schoolRoutes');

const app = express();
app.use(bodyParser.json());

initDB();

app.get('/', (req, res) => res.send(`<h1>🎉 Welcome to the School API! 🎓<h1/>`));
app.use('/api', schoolRoutes);

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}`));

module.exports = app;