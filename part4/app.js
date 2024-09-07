// Wrap all app modules and connect to DB

const express = require("express")
require('express-async-errors')
const app = express()
const cors = require("cors")
const mongoose = require("mongoose")
const logger = require("./utils/logger")
const config = require('./utils/config')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const middleware = require('./utils/middleware')

// Database connection
mongoose.set("strictQuery", false)
logger.info("Connecting to database ...")
mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info("Successfully connected to MongoDB")
  })
  .catch((error) => {
    logger.error("Error connection to MongoDB:", error.message)
  })
// Modules load
app.use(cors())
app.use(express.json())
// app.use(express.static('dist')) for connect with frontend
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
}
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

// Export wrapped app with modules loaded
module.exports = app
