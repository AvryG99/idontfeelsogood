const express = require('express');
const sql = require('mssql');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

// Azure SQL Database Configuration
const config = {
    user: process.env.DB_USER, // Replace with your database username
    password: process.env.DB_PASSWORD, // Replace with your database password
    server: process.env.DB_SERVER, // Replace with your server name
    database: process.env.DB_DATABASE, // Replace with your database name
    options: {
        encrypt: true, // Use this if you're on Windows Azure
        trustServerCertificate: true // Change to true for local dev / self-signed certs
    }
};

// Define a route for the main page
app.get('/', async (req, res) => {
    try {
        // Connect to the database
        await sql.connect(config);
        
        // Query the database
        const result = await sql.query`SELECT * FROM [User]`; // Replace with your table name

        // Send the result as JSON
        res.json(result.recordset);
    } catch (err) {
        console.error('SQL error', err);
        res.status(500).send('Error retrieving data from database');
    } finally {
        await sql.close();
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
