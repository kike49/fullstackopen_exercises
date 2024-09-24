import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import userService from "../services/users"

const Users = () => {
  const [allUsers, setAllUsers] = useState([])

  useEffect(() => {
    const fetchUsers = async () => {
      const users = await userService.getAllUsers()
      setAllUsers(users)
    }
    fetchUsers()
  }, [])

  return (
    <div className="container">
      <h2>Users</h2>
      <table>
        <thead>
          <tr>
            <th>User name</th>
            <th>Blogs</th>
          </tr>
        </thead>
        <tbody>
          {allUsers.map((user) => (
            <tr key={user.id}>
              <td>
                <Link to={`/users/${user.id}`}>{user.name}</Link>
              </td>
              <td>{user.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Users
