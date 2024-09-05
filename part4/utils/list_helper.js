// Testing functions module
const _ = require("lodash")

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, blog) => {
    return sum + blog.likes
  }
  return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return "No blogs in the list"
  }
  const reducer = (favorite, blog) => {
    return blog.likes > favorite.likes ? blog : favorite
  }
  const mostLikes = blogs.reduce(reducer, blogs[0])
  return {
    title: mostLikes.title,
    author: mostLikes.author,
    likes: mostLikes.likes,
  }
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return "No blogs in the list"
  }

  const authorCounts = _.countBy(blogs, "author")
  const maxBlogsAuthor = _.maxBy(
    _.map(authorCounts, (count, author) => ({ author, blogs: count })),
    "blogs"
  )
  return maxBlogsAuthor
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return "No blogs in the list"
  }
  const authorLikes = blogs.reduce((result, blog) => {
    const existingAuthor = result.find((item) => item.author === blog.author)
    if (existingAuthor) {
      existingAuthor.likes += blog.likes
    } else {
      result.push({ author: blog.author, likes: blog.likes })
    }
    return result
  }, [])
  const topAuthor = _.maxBy(authorLikes, "likes")
  return topAuthor
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}
