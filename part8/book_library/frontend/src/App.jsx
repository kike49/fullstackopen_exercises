import { useState } from "react";
import { useApolloClient, useSubscription, useQuery } from "@apollo/client";
import LoginForm from "./components/LoginForm";
import User from "./components/User";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import { ALL_BOOKS, BOOK_ADDED } from "./queries";

// Helper to clears the cache
export const updateCache = (cache, query, addedBook) => {
  const uniqByName = (a) => {
    let seen = new Set();
    return a.filter((item) => {
      let k = item.name;
      return seen.has(k) ? false : seen.add(k);
    });
  };
  cache.updateQuery(query, ({ allBooks }) => {
    return {
      allBooks: uniqByName(allBooks.concat(addedBook))
    };
  });
};

const App = () => {
  const [page, setPage] = useState("authors");
  const [errorMessage, setErrorMessage] = useState(null);
  const [token, setToken] = useState(null);
  const client = useApolloClient();
  useSubscription(BOOK_ADDED, {
    onData: ({ data, client }) => {
      const addedBook = data.data.bookAdded;
      window.alert(`${addedBook.title} added to the book library`);
      updateCache(client.cache, { query: ALL_BOOKS }, addedBook);
    }
  });
  const notify = (message) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage(null);
    }, 10000);
  };
  const logout = () => {
    setToken(null);
    localStorage.clear();
    client.resetStore();
  };
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
        {page === "login" && (
          <LoginForm
            show={page === "login"}
            setToken={setToken}
            setError={notify}
          />
        )}
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
        <button onClick={() => setPage("user")}>User</button>
        &nbsp;
        <button onClick={logout}>Logout</button>
      </div>
      <Authors show={page === "authors"} />
      <Books show={page === "books"} />
      <NewBook show={page === "add"} />
      {page === "user" && <User show={page == "user"} />}
    </div>
  );
};

export default App;
