import { useEffect, useState } from "react"
import { QueryClient, QueryClientProvider } from "react-query"
import { Route, Routes } from "react-router-dom"
import Users from "./components/Users"
import BlogList from "./components/BlogList"
import BlogDetails from "./components/BlogDetails"
import UserDetails from "./components/UserDetails"
import Menu from "./components/Menu"
import { useUser } from "./context/UserContext"

const queryClient = new QueryClient()

const App = () => {
  const { user, checkLoggedUser } = useUser()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      await checkLoggedUser()
      setLoading(false)
    }
    fetchUser()
  }, [])

  if (loading) {
    return <div className="container">Loading...</div>
  }

  return (
    <QueryClientProvider client={queryClient}>
      {user === null ? (
        <Routes>
          <Route path="/" element={<BlogList />} />
        </Routes>
      ) : (
        <>
          <Menu />
          <Routes>
            <Route path="/" element={<BlogList />} />
            <Route path="/blog/:id" element={<BlogDetails />} />
            <Route path="/users" element={<Users />} />
            <Route path="/users/:id" element={<UserDetails />} />
          </Routes>
        </>
      )}
    </QueryClientProvider>
  )
}

export default App
