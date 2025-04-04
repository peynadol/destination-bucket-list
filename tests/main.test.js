import { expect, test } from "vitest"
import { insertDestination, deleteDestination } from "../db/queries.js"

test("inserts new destination to db", () => {
	let destination = {
		location: "Tokyo",
		country: "Japan",
		notes: null,
		imageUrl: null,
	}
	const newDest = insertDestination(destination)
	expect(newDest).toHaveProperty("id")
	expect(newDest.location).toBe("Tokyo")
	expect(newDest.country).toBe("Japan")

	const deletedSuccess = deleteDestination(newDest.id)
	console.log("Delete success:", deletedSuccess)
	expect(deletedSuccess).toBe(true)
})


test("fails when missing required fields", () => {
	expect(() => insertDestination({ country: "Japan" })).toThrow()
})
