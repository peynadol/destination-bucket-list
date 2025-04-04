const db = require("./database.js")

function getAllDestinations() {
	const rows = db.prepare("SELECT * FROM destinations").all()
	return rows
}

function insertDestination(destination) {
	try {
		if (!destination) {
			throw new Error("No destination received")
		}
		if (destination.location === "" || destination.country === "") {
			throw new Error("Must provide Location and Country")
		}

		const { location, country, notes, imageUrl } = destination
		const insert = db.prepare("INSERT INTO destinations (location, country, notes, imageUrl) VALUES (?,?,?,?)")
		const result = insert.run(location, country, notes, imageUrl)
		return {
			id: result.lastInsertRowid,
			location,
			country,
			notes,
			imageUrl
		}

	} catch (error) {
		console.error("Insert failed:", error.message)
		throw error
	}
}

function deleteDestination(id) {
	console.log(typeof (id))
	try {
		if (typeof (id) != "number") {
			id = parseInt(id)
		}
		if (isNaN(id)) {
			throw new Error("Invalid ID received")
		}
		const remove = db.prepare("DELETE FROM destinations WHERE id = ?")
		const result = remove.run(id)
		return result.changes > 0;
	} catch (error) {
		console.error("Deletion failed:", error.message)
		throw error
	}
}

function updateDestination(id, destination) {
	try {
		if (typeof id !== "number") {
			id = parseInt(id)
		}
		if (isNaN(id)) {
			throw new Error("Invalid ID received")
		}
		if (!destination || !destination.location || !destination.country) {
			throw new Error("Must provide Location and Country")
		}

		const { location, country, notes, imageUrl } = destination
		const update = db.prepare(
			"UPDATE destinations SET location = ?, country = ?, notes = ?, imageUrl = ? WHERE id = ?"
		)
		const result = update.run(location, country, notes, imageUrl, id)

		return result.changes > 0
	} catch (error) {
		console.error("Update failed:", error.message)
		throw error
	}
}
module.exports = { getAllDestinations, insertDestination, deleteDestination, updateDestination }


