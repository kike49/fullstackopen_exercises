const { test, after, beforeEach, describe } = require("node:test")
const assert = require("node:assert")
const mongoose = require("mongoose")
const supertest = require("supertest")
const app = require("../app")
const api = supertest(app)
const helper = require("./test_helper")
const bcryptjs = require("bcryptjs")
const User = require("../models/user")

describe("Clean start with one user in DB", () => {
  beforeEach(async () => {
    await User.deleteMany({})
    const passwordHash = await bcryptjs.hash("secretpassword", 10)
    const user = new User({
      username: "test",
      name: "Test full name",
      passwordHash
    })
    await user.save()
  })

  test("New user created, stored and present in DB", async () => {
    const usersAtStart = await helper.usersInDb()
    const newUser = {
      username: "user2",
      name: "George del Trombo",
      password: "terracota"
    }
    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/)
    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)
    const usernames = usersAtEnd.map((u) => u.username)
    assert(usernames.includes(newUser.username))
  })

  test("Creation fails with proper statuscode and message if username already taken", async () => {
    const usersAtStart = await helper.usersInDb()
    const newUser = {
      username: "test",
      name: "Superuser",
      password: "password"
    }
    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/)
    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes("Expected `username` to be unique"))
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
})

describe("No users on the DB", () => {
  test("Creates an user with short username", async () => {
    const newUser = {
      username: "t",
      name: "Superuser",
      password: "password"
    }
    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/)
    assert(result.body.error.includes("shorter than the minimum allowed length (3)"))
  })

  test("Creates an user with short password", async () => {
    const newUser = {
      username: "test123",
      name: "Superuser",
      password: "p"
    }
    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/)
    assert(result.body.error.includes("Password must be at least 3 characters long"))
  })
})

after(async () => {
  await mongoose.connection.close()
})
