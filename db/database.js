const Database = require("better-sqlite3")

// connect to db or create if doesn't exist
const db = new Database("./database.sqlite", { verbose: console.log })


// create table
db.exec(`
CREATE TABLE IF NOT EXISTS destinations(
id INTEGER PRIMARY KEY AUTOINCREMENT,
location TEXT NOT NULL,
country TEXT NOT NULL,
notes TEXT,
imageUrl TEXT
)
`)



module.exports = db
