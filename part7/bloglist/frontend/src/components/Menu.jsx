import React, { useState, useEffect } from "react"
import { NavLink } from "react-router-dom"
import { useUser } from "../context/UserContext"
import { LogoutButton, NavbarContainer, StyledLink } from "../styles/styles"

const Menu = () => {
  const { user, logout, checkLoggedUser } = useUser()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      await checkLoggedUser()
      setLoading(false)
    }
    fetchUser()
  }, [])

  const handleLogout = () => {
    logout()
  }
  if (loading) {
    return <div className="container">Loading...</div>
  }
  return (
    <NavbarContainer>
      <NavLink>
        <StyledLink to="/">Blogs</StyledLink>
        <StyledLink to="/users">Users</StyledLink>
      </NavLink>
      <i>
        <b>{user.name}</b> logged in &nbsp;
      </i>
      <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
    </NavbarContainer>
  )
}

export default Menu
