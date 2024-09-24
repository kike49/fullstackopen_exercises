import ReactDOM from "react-dom/client"
import App from "./App"
import "./index.css"
import { NotificationProvider } from "./context/NotificationContext"
import { UserProvider } from "./context/UserContext"
import { BrowserRouter as Router } from "react-router-dom"

ReactDOM.createRoot(document.getElementById("root")).render(
  <Router>
    <UserProvider>
      <NotificationProvider>
        <App />
      </NotificationProvider>
    </UserProvider>
  </Router>
)
