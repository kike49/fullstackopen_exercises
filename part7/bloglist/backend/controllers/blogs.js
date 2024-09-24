// Path operations (routes) for blogs schema

const blogsRouter = require("express").Router()
const Blog = require("../models/blog")
const Comment = require("../models/comment")
const middleware = require("../utils/middleware")

// Get all blogs
blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 })
  response.json(blogs)
})

// Get one blog
blogsRouter.get("/:id", async (request, response) => {
  const blogToShow = await Blog.findById(request.params.id).populate("user", { username: 1, name: 1 }).populate("comments")
  if (blogToShow) {
    response.json(blogToShow)
  } else {
    response.status(404).end()
  }
})

// Add a blog
blogsRouter.post("/", middleware.userExtractor, async (request, response) => {
  const user = request.user
  const blog = new Blog({
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes,
    user: user.id
  })
  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  response.status(201).json(savedBlog)
})

// Delete a blog
blogsRouter.delete(
  "/:id",
  middleware.userExtractor,
  async (request, response) => {
    const user = request.user
    const blogToDelete = await Blog.findById(request.params.id)
    if (blogToDelete.user.toString() === user.id.toString()) {
      await Blog.findByIdAndDelete(request.params.id)
    }
    response.status(204).end()
  }
)

// Update a blog's likes
blogsRouter.put("/:id", async (request, response) => {
  const blog = { likes: request.body.likes }
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true
  })
  response.json(updatedBlog)
})

// Get comments for a blog
blogsRouter.get("/:id/comments", async (request, response) => {
  const blog = await Blog.findById(request.params.id).populate("comments")
  if (blog) {
    response.json(blog.comments)
  } else {
    response.status(404).end()
  }
})

// Add a comment to a blog (authentication optional)
blogsRouter.post("/:id/comments", async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(404).json({ error: 'Blog not found' })
  }
  let user = null
  let author = 'Anonymous'
  // Check for authentication token
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    const token = authorization.substring(7)
    try {
      const decodedToken = jwt.verify(token, process.env.SECRET)
      if (decodedToken.id) {
        user = decodedToken.id
        author = request.body.author || decodedToken.username
      }
    } catch (error) {
      // Token verification failed, continue as anonymous
    }
  }
  const comment = new Comment({
    content: request.body.content,
    blog: blog._id,
    user: user,
    author: request.body.author || author
  })
  const savedComment = await comment.save()
  if (!blog.comments) {
    blog.comments = []
  }
  blog.comments = blog.comments.concat(savedComment._id)
  await blog.save()
  response.status(201).json(savedComment)
})

module.exports = blogsRouter
