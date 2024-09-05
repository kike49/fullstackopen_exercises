// Functionalities to log in de user and manage the token

const jwt = require("jsonwebtoken")
const bcryptjs = require("bcryptjs")
const loginRouter = require("express").Router()
const User = require("../models/user")

// Log in
loginRouter.post("/", async (request, response) => {
  const { username, password } = request.body
  const user = await User.findOne({ username })
  const passwordCorrect =
    user === null ? false : await bcryptjs.compare(password, user.passwordHash)
  if (!(user && passwordCorrect)) {
    return response.status(401).json({ error: "Invalid username or password" })
  }
  const userForToken = {
    username: user.username,
    id: user._id
  }
  const token = jwt.sign(userForToken, process.env.SECRET) // add {expiresIn: x } to set a seconds expiration for the token
  response.status(200).send({ token, username: user.username, name: user.name })
})

module.exports = loginRouter
