// DOM ELEMENTS
const form = document.querySelector("#add-destination-form")
const editForm = document.querySelector("#edit-destination-form")
const destinationList = document.querySelector("#destination-list")
const notesTextArea = document.querySelector("#notes")
let destinations = []
let currentlyEditingId = null


// submit using shortcut as enter in text area behaves differently
notesTextArea.addEventListener("keydown", (e) => {
	if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
		e.preventDefault()

		const submitButton = form.querySelector("button[type='submit']")
		if (submitButton) {
			submitButton.click()
		} else {
			form.requestSubmit()
		}
	}
})

// fetch destinations from backend
async function fetchDestinations() {
	try {
		const response = await fetch("http://localhost:3000/api/destinations")
		if (!response.ok) throw new Error("Failed to fetch")
		const data = await response.json()
		return data
	} catch (error) {
		console.error("Error fetching destinations:", error)
		return []
	}
}


// send new destination to server
async function sendDestination(destination) {
	await fetch("http://localhost:3000/api/destinations", {
		method: "POST",
		body: JSON.stringify(destination),

		headers: {
			"Content-Type": "application/json; charset=UTF-8"
		}
	})
	await renderDestinations()
}

// Form Submit Handler
form.addEventListener("submit", (e) => {
	e.preventDefault()

	const newDestination = {
		//id: Date.now(), // maybe try a uuid package
		location: document.querySelector("#location").value,
		country: document.querySelector("#country").value,
		notes: document.querySelector("#notes").value,
	}

	// add to local array, replace with API call later
	sendDestination(newDestination)

	// reset form
	form.reset()

	document.querySelector("#location").focus()
})

// send edit to server
async function sendEditDestination(id, updatedData) {
	try {
		const response = await fetch(`http://localhost:3000/api/destinations/${id}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(updatedData)
		});
		if (!response.ok) throw new Error("Update failed");
		await renderDestinations(); // Refresh the list
	} catch (error) {
		console.error("Edit error:", error);
		throw error; // Let the form handler show the alert
	}
}

// Edit form submit handler
editForm.addEventListener("submit", async (e) => {
	e.preventDefault()

	const updatedDestination = {
		location: document.querySelector("#edit-location").value,
		country: document.querySelector("#edit-country").value,
		notes: document.querySelector("#edit-notes").value,
	}

	try {
		await sendEditDestination(currentlyEditingId, updatedDestination)

		document.querySelector("#edit-form-container").style.display = "none"
		document.querySelector("#add-destination-form").style.display = "block"

	} catch {
		alert("Failed to save changes")
	}
})

// Cancel Edit Button Handler
document.getElementById('cancel-edit').addEventListener('click', () => {
	document.getElementById('edit-form-container').style.display = 'none';
	document.getElementById('add-destination-form').style.display = 'block';
	currentlyEditingId = null;
});

// delete destination handler
const deleteDestination = async (id) => {
	try {
		const response = await fetch(`http://localhost:3000/api/destinations/${id}`, {
			method: "DELETE",
		})

		if (!response.ok) throw new Error("Failed to delete")
		await renderDestinations()
	} catch (error) {
		console.error("Delete failed:", error)
	}
}

const editDestination = async (id) => {
	try {
		const response = await fetch(`http://localhost:3000/api/destinations/${id}`)
		if (!response.ok) throw new Error("Failed to fetch destination")
		const { data: destination } = await response.json()

		// populate the edit form
		document.querySelector('#edit-id').value = destination.id;
		document.querySelector('#edit-location').value = destination.location;
		document.querySelector('#edit-country').value = destination.country;
		document.querySelector('#edit-notes').value = destination.notes || '';

		// Show the edit form and hide the add form
		document.querySelector('#edit-form-container').style.display = 'block';
		document.querySelector('#add-destination-form').style.display = 'none';

		currentlyEditingId = id;
	} catch (error) {
		console.error("Error preparing edit:", error);
		alert("Couldn't load destination for editing");
	}
}


// render all destinations
const renderDestinations = async () => {
	destinationList.innerHTML = ""

	const data = await fetchDestinations()
	const destinations = data.data

	if (destinations.length === 0) {
		const noDestP = document.createElement("p")
		noDestP.textContent = "No destinations added yet."
		destinationList.appendChild(noDestP)
		return
	}

	destinations.forEach(dest => {
		const card = document.createElement("div")
		card.className = "destination-card"


		// create destination name and location
		const title = document.createElement("h4")
		title.textContent = `${dest.location}, ${dest.country}`
		card.appendChild(title)

		const mapLink = document.createElement("a");
		mapLink.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(dest.location + ', ' + dest.country)}`;
		mapLink.textContent = "📍 View on Map";
		mapLink.target = "_blank";
		mapLink.style.display = "inline-block";
		mapLink.style.margin = "0.5rem 0";
		card.appendChild(mapLink);
		// add notes if available
		if (dest.notes) {
			const notes = document.createElement("p")
			notes.textContent = dest.notes
			card.appendChild(notes)
		}


		// create button div
		const buttonsDiv = document.createElement("div")
		buttonsDiv.className = "buttons"
		// create delete button
		const deleteButton = document.createElement("button")
		deleteButton.textContent = "❌"
		deleteButton.title = "Delete"
		deleteButton.classList.add("delete-btn")
		deleteButton.addEventListener("click", () => deleteDestination(dest.id))

		// create edit button
		const editButton = document.createElement("button")
		editButton.textContent = "✏️"
		editButton.title = "Edit"
		editButton.classList.add("edit-btn")
		editButton.addEventListener("click", () => editDestination(dest.id))

		buttonsDiv.appendChild(deleteButton)
		buttonsDiv.appendChild(editButton)
		card.appendChild(buttonsDiv)

		// add card to destination list
		destinationList.appendChild(card)
	})
}

// init
renderDestinations()
document.querySelector("#location").focus();
