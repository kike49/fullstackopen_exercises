import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import Notification from "./Notification"
import LoginForm from "./LoginForm"
import BlogForm from "./BlogForm"
import { useBlogQueries } from "../hooks/useBlogQueries"
import { useNotification } from "../context/NotificationContext"
import { useUser } from "../context/UserContext"
import { Box } from "../styles/styles"

const BlogList = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [blogFormVisible, setBlogFormVisible] = useState(false)
  const [notification, dispatch] = useNotification()
  const { user, login, checkLoggedUser } = useUser()
  const { blogs, isLoading, isError, createBlog } = useBlogQueries()

  useEffect(() => {
    checkLoggedUser()
  }, [])

  const showNotification = (message, classMessage) => {
    dispatch({ type: "SET_NOTIFICATION", message, classMessage })
    setTimeout(() => {
      dispatch({ type: "CLEAR_NOTIFICATION" })
    }, 5000)
  }

  const addBlog = (blogObject) => {
    createBlog(blogObject, {
      onSuccess: (returnedBlog) => {
        showNotification(
          `The blog '${returnedBlog.title}' from '${returnedBlog.author}' added to the list`,
          "confirmation"
        )
        setBlogFormVisible(false)
      },
      onError: (error) => {
        showNotification("Failed to create blog", "error")
      }
    })
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      await login(username, password)
      setUsername("")
      setPassword("")
    } catch (exception) {
      showNotification("Wrong username or password, try again", "error")
    }
  }

  const showBlogForm = () => {
    const hideWhenVisible = { display: blogFormVisible ? "none" : "" }
    const showWhenVisible = { display: blogFormVisible ? "" : "none" }
    return (
      <div className="container">
        <div style={hideWhenVisible}>
          <button onClick={() => setBlogFormVisible(true)}>New blog</button>
        </div>
        <div style={showWhenVisible}>
          <BlogForm createBlog={addBlog} />
          <button onClick={() => setBlogFormVisible(false)}>Cancel</button>
        </div>
      </div>
    )
  }

  if (isLoading) return <div className="container">Loading...</div>
  if (isError) return <div className="container">Error loading blogs</div>

  return (
    <div className="container">
      <Notification
        message={notification.message}
        classMessage={notification.classMessage}
      />
      {user === null ? (
        <>
          <h2>Log in</h2>
          <LoginForm
            handleSubmit={handleLogin}
            handleUsername={({ target }) => setUsername(target.value)}
            handlePassword={({ target }) => setPassword(target.value)}
            username={username}
            password={password}
          />
        </>
      ) : (
        <>
          <div className="container">
            <h3>Add a new blog</h3>
            {showBlogForm()}
            <hr />
          </div>
          <div className="container">
            <h3>Blogs saved ({blogs.length})</h3>
            {blogs.map((blog) => (
              <div key={blog.id}>
                <Box>
                  <Link to={`/blog/${blog.id}`}>{blog.title}</Link>
                </Box>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default BlogList
