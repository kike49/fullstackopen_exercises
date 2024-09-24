import { useState, useEffect } from "react"
import userService from "../services/users"

const Blog = ({ blog, updateBlog, deleteBlog, currentUser }) => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const fetchUser = async () => {
      if (blog.user && typeof blog.user === "string") {
        const userData = await userService.getUser(blog.user)
        setUser(userData)
      } else {
        setUser(blog.user) // if blog already contains user object
      }
    }
    fetchUser()
  }, [blog.user])

  const likeHandle = () => {
    const updatedBlog = { ...blog, likes: blog.likes + 1 }
    updateBlog({ id: blog.id, newObject: updatedBlog })
  }

  const deleteHandle = () => {
    deleteBlog(blog.id)
  }

  return (
    <div className="blog">
      <div className="blog-header">
        <h3>{blog.title} -- by <i>{blog.author}</i></h3>
      </div>
      <div className="blog-details">
        <b>Link:</b> <a href={blog.url}>{blog.url}</a>
        <br />
        <b>Likes:</b> {blog.likes} &nbsp;
        <button onClick={likeHandle}>Like</button>
        {user && (
          <div className="container">
            <b>Added by:</b> <u>{user.username}</u>
          </div>
        )}
        {user && user.username === currentUser.username && (
          <div className="container">
            <button onClick={deleteHandle}>Delete</button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Blog
