// App's main component and wrapping frontend HTML

import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [message, setMessage] = useState(null)
  const [classMessage, setClassMessage] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [blogFormVisible, setBlogFormVisible] = useState(false)

  // Refresh all the blogs variable available after any change
  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs.sort((a, b) => b.likes - a.likes)))
  }, [])

  // Catch the user logged in and gives the token to the protected routes
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const addBlog = (blogObject) => {
    blogService.create(blogObject).then((returnedBlog) => {
      setBlogs(blogs.concat(returnedBlog))
      setMessage(`The blog '${returnedBlog.title}' from '${returnedBlog.author}' added to the list`)
      setClassMessage('confirmation')
      setTimeout(() => {
        setMessage(null)
        setClassMessage(null)
      }, 5000)
    })
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('') // restart username and password form fields
      setPassword('')
    } catch (exception) {
      setMessage('Wrong username or password, try again')
      setClassMessage('error')
      setTimeout(() => {
        setMessage(null)
        setClassMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.clear // To logout an user from the console
    setUser(null)
  }

  const showBlogForm = () => {
    const hideWhenVisible = { display: blogFormVisible ? 'none' : '' }
    const showWhenVisible = { display: blogFormVisible ? '' : 'none' }
    return (
      <div>
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

  // Update the blog in the frontend with new likes
  const updateBlog = (updatedBlog) => {
    const blogUpdated = (blogs.map(b => b.id !== updatedBlog.id ? b : updatedBlog))
    setBlogs(blogUpdated.sort((a, b) => b.likes - a.likes))
  }

  const deleteBlog = (id) => {
    setBlogs(blogs.filter(b => b.id !== id))
  }

  return (
    <div>
      <Notification message={message} classMessage={classMessage} />
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
          <div>
            <h2>Blogs app</h2>
            <i>
              <u>{user.name}</u> logged in{' '}
            </i>
            <button onClick={handleLogout}>Logout</button>
            <br />
            <br />
            {showBlogForm()}
          </div>
          <h3>Blogs saved ({blogs.length})</h3>
          <div>
            {blogs.map((blog) => (
              <Blog key={blog.id} blog={blog} updateBlog={updateBlog} deleteBlog={deleteBlog} currentUser={user}/>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default App
