const { test, after, describe, beforeEach } = require("node:test")
const assert = require("node:assert")
const mongoose = require("mongoose")
const supertest = require("supertest")
const app = require("../app")
const api = supertest(app)
const helper = require("./test_helper")
const Blog = require("../models/blog")
const User = require("../models/user")
const jwt = require("jsonwebtoken")
const bcryptjs = require("bcryptjs")

describe("Testing without authorization", () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    const blogObjects = helper.initialTestBlogs.map((blog) => new Blog(blog))
    const promiseArray = blogObjects.map((b) => b.save()) // save here all the promises of individual blog saves
    await Promise.all(promiseArray)
  })

  // Test for exercise 4.8
  test("Blogs are returned as JSON and length is same as initialTestBlogs", async () => {
    const response = await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/)
    assert.strictEqual(response.body.length, helper.initialTestBlogs.length)
  })

  // Test for exercise 4.9
  test("id property named correctly", async () => {
    const blogsSaved = await helper.blogsInDb()
    blogsSaved.forEach((blog) => {
      assert(blog.id !== undefined)
      assert(blog._id === undefined)
    })
  })

  // Extra test
  test("There is a blog talking about C#", async () => {
    const response = await api.get("/api/blogs")
    const titles = response.body.map((e) => e.title)
    assert(titles.some((title) => title.includes("C#")))
  })

  // Test exercise 4.14
  test("Update a blog's likes", async () => {
    const blogsSaved = await helper.blogsInDb()
    const blogToUpdate = blogsSaved[0]
    const newLikes = { likes: blogToUpdate.likes + 1 }
    const resultBlog = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .set("Authorization", `Bearer ${this.token}`)
      .send(newLikes)
      .expect(200)
    assert.strictEqual(resultBlog.body.likes, newLikes.likes)
  })

  // Test exercise 4.23
  test("New blog added failed without authorization", async () => {
    const newBlog = {
      title: "The new entry",
      author: "Palotes from Perico",
      url: "www.p-palotes.com",
      likes: 21
    }
    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(401)
      .expect("Content-Type", /application\/json/)
    const blogsSaved = await helper.blogsInDb()
    assert.strictEqual(blogsSaved.length, helper.initialTestBlogs.length)
  })
})

describe("Testing post/deletes routes that requires users authorization", () => {
  beforeEach(async () => {
    await User.deleteMany({})
    await Blog.deleteMany({})
    // Create test user
    const passwordHash = await bcryptjs.hash("password", 10)
    const user = new User({
      username: "testuser",
      passwordHash
    })
    await user.save()
    //Creates test blogs and associate them to the test user
    const blogObjects = helper.initialTestBlogs.map((blog) => {
      return new Blog({
        ...blog,
        user: user._id
      })
    })
    // Save test blogs
    const promiseArray = blogObjects.map((b) => b.save()) // save here all the promises of individual blog saves
    await Promise.all(promiseArray)
    // Generate token
    const userForToken = {
      username: user.username,
      id: user._id
    }
    this.token = jwt.sign(userForToken, process.env.SECRET)
  })

  // Test exercise 4.10
  test("New blog added", async () => {
    const newBlog = {
      title: "The new entry",
      author: "Palotes from Perico",
      url: "www.p-palotes.com",
      likes: 21
    }
    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${this.token}`)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/)
    const blogsSaved = await helper.blogsInDb()
    const titles = blogsSaved.map((t) => t.title)
    assert.strictEqual(blogsSaved.length, helper.initialTestBlogs.length + 1)
    assert(titles.includes("The new entry"))
  })

  // Test exercise 4.11
  test("New blog added without likes, default 0", async () => {
    const newBlog = {
      title: "No likes blog",
      author: "Antonio de Maizena",
      url: "www.sernio.com"
    }
    const response = await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${this.token}`)
      .send(newBlog)
      .expect(201)
    const savedBlog = response.body
    assert.strictEqual(savedBlog.likes, 0)
  })

  // Test exercise 4.12
  test("Blog without title/url not added and 400 response", async () => {
    const newBlog = {
      author: "Josh Harling"
    }
    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${this.token}`)
      .send(newBlog)
      .expect(400)
    const blogsSaved = await helper.blogsInDb()
    assert.strictEqual(blogsSaved.length, helper.initialTestBlogs.length)
  })

  // Test exercise 4.13
  test("Delete a blog", async () => {
    const blogsSaved = await helper.blogsInDb()
    const blogToDelete = blogsSaved[0]
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set("Authorization", `Bearer ${this.token}`)
      .expect(204)
    const blogsAfterDelete = await helper.blogsInDb()
    const titles = blogsAfterDelete.map((b) => b.title)
    assert(!titles.includes(blogToDelete.title))
    assert.strictEqual(
      blogsAfterDelete.length,
      helper.initialTestBlogs.length - 1
    )
  })
})

after(async () => {
  await mongoose.connection.close()
})
