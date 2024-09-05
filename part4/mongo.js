// Mock module to add data into the DB directly without launching the app

const mongoose = require("mongoose")
const config = require("./utils/config")

const url = config.MONGODB_URI

mongoose.set("strictQuery", false)
mongoose.connect(url).then(() => {
  const blogSchema = new mongoose.Schema({
    title: String,
    author: String,
    likes: Number,
  })

  const Blog = mongoose.model("Blog", blogSchema)

  const blog1 = new Blog({
    title: "C# topics",
    author: "Mr. Crane",
    likes: 2,
  })

  const blog2 = new Blog({
    title: "Amanece que no es poco",
    author: "Juan de la Sierra",
    likes: 24,
  })

  Promise.all([blog1.save(), blog2.save()])
    .then((results) => {
      console.log("Both blogs saved!")
      mongoose.connection.close()
    })
    .catch((error) => {
      console.error("Error saving blogs:", error)
      mongoose.connection.close()
    })
})
