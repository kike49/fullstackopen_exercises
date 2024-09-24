// Path operations (routes) for user schema

const bcryptjs = require("bcryptjs")
const usersRouter = require("express").Router()
const User = require("../models/user")

// Create an user
usersRouter.post("/", async (request, response) => {
  const { username, name, password } = request.body
  if (password.length < 3) {
    return response.status(400).json({ error: "Password must be at least 3 characters long"})
  }
  const saltRounds = 10
  const passwordHash = await bcryptjs.hash(password, saltRounds)
  const user = new User({
    username,
    name,
    passwordHash,
  })
  const savedUser = await user.save()
  response.status(201).json(savedUser)
})

// Get all users
usersRouter.get('/', async (request, response) => {
    const users = await User
        .find({}).populate('blogs', { url: 1, title: 1, author: 1 })
    response.json(users)
})

// Get one users
usersRouter.get('/:id', async (request, response) => {
  const user = await User
      .findById(request.params.id)
      .populate('blogs', { url: 1, title: 1, author: 1 })
  if (user) {
    response.json(user)
  } else {
    response.status(404).json({ error: 'User not found' })
  }
})

module.exports = usersRouter
