
const Database = require("better-sqlite3")
const fs = require("fs")
const path = require("path")

const renderDbPath = "/opt/render/.data/db.sqlite"
const localDbPath = path.join(__dirname, "db.sqlite")

const dbPath = process.env.NODE_ENV === "production" ? renderDbPath : localDbPath

if (process.env.NODE_ENV === "production") {
	const dbFolder = path.dirname(renderDbPath)
	if (!fs.existsSync(dbFolder)) {
		fs.mkdirSync(dbFolder, { recursive: true })
	}
}

const db = new Database(dbPath)

// Create table if it doesn't already exist
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
