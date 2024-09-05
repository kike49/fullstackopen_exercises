// Helper functions to run tests

const Blog = require("../models/blog")
const User = require("../models/user")

const initialTestBlogs = [
  {
    title: "C# topics",
    author: "Mr. Crane",
    url: "https://test1.com/",
    likes: 2,
  },
  {
    title: "Coding in winter",
    author: "Elfus Roadhes",
    url: "https://test21.com/",
    likes: 12,
  },
]

const blogNoId = async () => {
  const blog = new Blog({
    title: "Blog to be deleted",
    author: "P. Pollens",
  })
  await blog.save()
  await blog.deleteOne()
  return note._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map((blog) => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

module.exports = {
  initialTestBlogs,
  blogNoId,
  blogsInDb,
  usersInDb
}
