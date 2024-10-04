import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { ALL_AUTHORS, ALL_BOOKS, EDIT_YEAR } from "../queries";

const Authors = (props) => {
  const [name, setName] = useState("");
  const [setBornTo, setSetBornTo] = useState("");
  const { loading, error, data } = useQuery(ALL_AUTHORS);
  const [editAuthor] = useMutation(EDIT_YEAR, {
    refetchQueries: [{ query: ALL_AUTHORS }, { query: ALL_BOOKS }],
    onError: (error) => {
      console.error("Error editing author year:", error.message);
    }
  });

  if (!props.show) {
    return null;
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  
  const authors = data.allAuthors;
  const submit = async (event) => {
    event.preventDefault();
    if (!name || !setBornTo) {
      console.error("Name and birth year are required");
      return;
    }
    try {
      await editAuthor({
        variables: {
          name,
          setBornTo: parseInt(setBornTo)
        }
      });
      setName("");
      setSetBornTo("");
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div>
      <h2>Authors</h2>
      <table>
        <tbody>
          <tr>
            <th>Name</th>
            <th>Born</th>
            <th>Books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Set birth year</h3>
      <form onSubmit={submit}>
        <div>
          <label>
            Name:
            <select
              value={name}
              onChange={({ target }) => setName(target.value)}
            >
              <option value="">Select an author</option>
              {authors.map((a) => (
                <option key={a.id} value={a.name}>
                  {a.name}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div>
          <label>
            Born year:
            <input
              type="number"
              value={setBornTo}
              onChange={({ target }) => setSetBornTo(target.value)}
            />
          </label>
        </div>
        <button type="submit">Update author</button>
      </form>
    </div>
  );
};

export default Authors;
