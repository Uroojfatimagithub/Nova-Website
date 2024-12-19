const sql = require("mssql");

// Load environment variables
require("dotenv").config();

const config = {
    user: process.env.DB_USER,             // Admin username
    password: process.env.DB_PASSWORD,     // Admin password
    server: process.env.DB_SERVER,         // Server address
    database: process.env.DB_DATABASE,     // Database name
    options: {
        encrypt: true,                     // Required for Azure SQL
        enableArithAbort: true,
    },
};

// Create and export a connection pool
const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then((pool) => {
        console.log("Connected to SQL Server!");
        return pool;
    })
    .catch((err) => {
        console.error("Database Connection Failed! Error:", err);
        throw err;
    });

module.exports = poolPromise;
