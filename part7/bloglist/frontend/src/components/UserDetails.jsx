import React, { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import userService from "../services/users"

const UserDetails = () => {
  const { id } = useParams()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await userService.getUser(id)
      setUser(userData)
      setLoading(false)
    }
    fetchUser()
  }, [])
  if (loading) {
    return <div className="container">Loading...</div>
  }
  return (
    <div className="container">
      <h3>Blogs from {user.username}</h3>
      <ul>
        {user.blogs.map((blog) => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </div>
  )
}

export default UserDetails
