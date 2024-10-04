import { ALL_BOOKS, ALL_AUTHORS } from "../queries";
import { useQuery } from "@apollo/client";

const Books = (props) => {
  if (!props.show) {
    return null;
  }

  const { loading, error, data } = useQuery(ALL_BOOKS, {
    refetchQueries: [{ query: ALL_BOOKS }, { query: ALL_AUTHORS }]
  });
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  const books = data.allBooks;

  return (
    <div>
      <h2>Books</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>Author</th>
            <th>Published</th>
            <th>Genres</th>
          </tr>
          {books.map((b) => (
            <tr key={b.id}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
              <td>{b.genres.join(", ")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Books;
