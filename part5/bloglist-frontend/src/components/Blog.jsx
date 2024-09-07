// Blog component
import { useState, useEffect } from 'react'
import blogService from '../services/blogs'
import userService from '../services/users'

const Blog = ({ blog, updateBlog, deleteBlog, currentUser }) => {
  const [detailsVisible, setDetailsVisible] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const fetchUser = async () => {
      if (blog.user && typeof blog.user === 'string') {
        const userData = await userService.getUser(blog.user)
        setUser(userData)
      } else {
        setUser(blog.user) // if blog already contains user object
      }
    }
    fetchUser()
  }, [blog.user])

  const toggleDetailsVisibility = () => {
    setDetailsVisible(!detailsVisible)
  }

  const likeHandle = async () => {
    const updatedBlog = { ...blog, likes: blog.likes + 1 }
    const returnedBlog = await blogService.update(blog.id, updatedBlog)
    updateBlog(returnedBlog) // update the blog from the props in the app's state
  }

  const deleteHandle = async () => {
    if (window.confirm(`Do you want to delete the blog ${blog.title}?`)) {
      await blogService.remove(blog.id) // call the route on the backend
      deleteBlog(blog.id) // call the function on the frontend
    }
  }

  return (
    <div className="blog">
      <div className="blog-header">
        {blog.title} -- by <i>{blog.author}</i> &nbsp;
        <button onClick={toggleDetailsVisibility}>
          {detailsVisible ? 'Hide' : ' Show'}
        </button>
      </div>
      {detailsVisible && (
        <div className="blog-details">
          <b>Link:</b> <a href={blog.url}>{blog.url}</a>
          <br />
          <b>Likes:</b> {blog.likes} &nbsp;
          <button onClick={likeHandle}>Like</button>
          {user && (
            <div>
              <b>Added by:</b> <u>{user.username}</u>
            </div>
          )}
          {user && user.username === currentUser.username && (
            <div>
              <button onClick={deleteHandle}>Delete</button>
            </div>
          )}
        </div>
      )}
      <hr />
    </div>
  )
}

export default Blog
