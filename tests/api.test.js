import { expect, test } from "vitest"
import request from "supertest"
import app from "../server.js"

test("GET /destinations returns 200", async () => {
	const response = await request(app).get("/api/destinations")
	expect(response.statusCode).toBe(200)
})


test("DELETE /api/destinations/:id with invalid ID returns 404", async () => {
	const response = await request(app)
		.delete("/api/destinations/999999")
		.set("Accept", "application/json")

	expect(response.statusCode).toBe(404)
	expect(response.body).toEqual({
		status: "error",
		message: "Destination not found"
	})
})
