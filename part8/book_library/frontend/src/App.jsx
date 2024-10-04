import { useState } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import { useApolloClient, useQuery } from "@apollo/client";
import LoginForm from "./components/LoginForm";

const App = () => {
  const [page, setPage] = useState("authors");
  const [errorMessage, setErrorMessage] = useState(null);
  const [token, setToken] = useState(null);
  const client = useApolloClient();
  const notify = (message) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage(null);
    }, 10000);
  };
  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }
  if (!token) {
    return (
      <div>
        <div>
          <button onClick={() => setPage("authors")}>Authors</button>
          &nbsp;
          <button onClick={() => setPage("books")}>Books</button>
          &nbsp;
          <button onClick={() => setPage("login")}>Login</button>
          &nbsp;
        </div>
        <Authors show={page === "authors"} />
        <Books show={page === "books"} />
        {page==="login" && <LoginForm show={page === "login"} setToken={setToken} setError={notify} />}
      </div>
    );
  }
  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>Authors</button>
        &nbsp;
        <button onClick={() => setPage("books")}>Books</button>
        &nbsp;
        <button onClick={() => setPage("add")}>Add book</button>
        &nbsp;
        <button onClick={logout}>Logout</button>
      </div>
      <Authors show={page === "authors"} />
      <Books show={page === "books"} />
      <NewBook show={page === "add"} />
    </div>
  );
};

export default App;
