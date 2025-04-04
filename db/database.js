const Database = require("better-sqlite3")
const path = require("path")

const renderDbPath = "/opt/render/.data/db.sqlite"
const localDbPath = path.join(__dirname, "db.sqlite")

const dbPath = process.env.NODE_ENV === "production" ? renderDbPath : localDbPath

const db = new Database(dbPath)

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
