import React, { createContext, useReducer, useContext } from "react"
import loginService from "../services/login"
import blogService from "../services/blogs"

const UserContext = createContext()

const userReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return action.payload
    case "LOGOUT":
      return null
    default:
      return state
  }
}

export const UserProvider = ({ children }) => {
  const [user, dispatch] = useReducer(userReducer, null)

  const login = async (username, password) => {
    const user = await loginService.login({ username, password })
    window.localStorage.setItem("loggedUser", JSON.stringify(user))
    blogService.setToken(user.token)
    dispatch({ type: "LOGIN", payload: user })
    return user
  }

  const logout = () => {
    window.localStorage.removeItem("loggedUser")
    blogService.setToken(null)
    dispatch({ type: "LOGOUT" })
  }

  const checkLoggedUser = () => {
    const loggedUserJSON = window.localStorage.getItem("loggedUser")
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      blogService.setToken(user.token)
      dispatch({ type: "LOGIN", payload: user })
    }
  }

  return (
    <UserContext.Provider value={{ user, login, logout, checkLoggedUser }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  const context = useContext(UserContext)
  return context
}
