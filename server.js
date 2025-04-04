const { getAllDestinations, insertDestination, deleteDestination, updateDestinati, updateDestination } = require("./db/queries.js")
const express = require("express")
const cors = require("cors")
const app = express()
const port = 3000

app.use(express.static("public"))
app.use(express.json())
app.use(cors())

// endpoint to view entries for testing
app.get('/test-db', (req, res) => {
	const results = getAllDestinations()
	console.log("DB Results:", results)
	res.send(results)
});


// fetch all entries from destinations table
app.get("/api/destinations", (req, res) => {
	try {
		const destinations = getAllDestinations()

		if (!destinations || destinations.length === 0) {
			return res.status(200).json({
				status: "success",
				message: "No destinations found",
				data: []
			})
		}

		res.status(200).json({
			status: "success",
			data: destinations
		})
	} catch (error) {
		console.error("Error fetching destinations:", error)
		res.status(500).json({
			status: "error",
			message: error.message
		})
	}
})

// fetch individual entry, needed for editing
app.get("/api/destinations/:id", (req, res) => {
	try {
		const id = req.params.id;
		const destination = getAllDestinations().find(dest => dest.id == id); // Fetch from DB if getAllDestinations() returns an array

		if (!destination) {
			return res.status(404).json({
				status: "error",
				message: "Destination not found"
			});
		}

		res.status(200).json({
			status: "success",
			data: destination
		});
	} catch (error) {
		console.error("Error fetching destination:", error);
		res.status(500).json({
			status: "error",
			message: error.message
		});
	}
});

// insert received data into sql db
app.post("/api/destinations", (req, res) => {
	try {
		const data = req.body
		insertDestination(data)
		res.status(201).json({
			status: "success",
			message: "Destination successfully posted",
			data: data
		})
	} catch (error) {
		console.error("Error posting destination:", error)
		res.status(500).json({
			status: "error",
			message: error.message
		})
	}
})

// delete from db
app.delete("/api/destinations/:id", (req, res) => {
	try {
		const idToDelete = req.params.id
		const success = deleteDestination(idToDelete)

		if (!success) {
			return res.status(404).json({
				status: "error",
				message: "Destination not found"
			})
		}

		res.sendStatus(204)
	} catch (error) {
		console.error("Error deleting destination:", error)
		res.status(500).json({
			status: "error",
			message: error.message
		})
	}
})

// edit destination in db
app.put("/api/destinations/:id", (req, res) => {
	try {
		const id = req.params.id;
		const updates = req.body;

		if (!updates.location || !updates.country) {
			return res.status(400).json({
				status: "error",
				message: "Location and country are required"
			});
		}

		const success = updateDestination(id, updates);

		if (!success) {
			return res.status(404).json({
				status: "error",
				message: "Destination not found"
			});
		}

		res.sendStatus(204);
	} catch (error) {
		console.error("Error updating destination:", error);
		res.status(500).json({
			status: "error",
			message: "Failed to update destination"
		});
	}
});

module.exports = app

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})
