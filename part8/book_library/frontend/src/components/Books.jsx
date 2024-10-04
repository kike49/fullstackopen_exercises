import { useState } from "react";
import { ALL_BOOKS, ALL_AUTHORS, ALL_GENRES, BOOK_BY_GENRE } from "../queries";
import { useQuery } from "@apollo/client";

const Books = (props) => {
  const [selectedGenre, setSelectedGenre] = useState(null);
  const { loading, error, data } = useQuery(ALL_BOOKS, {
    refetchQueries: [{ query: ALL_BOOKS }, { query: ALL_AUTHORS }]
  });
  const {
    loading: genresLoading,
    error: genresError,
    data: genresData
  } = useQuery(ALL_GENRES);
  const {
    loading: bookByGenresLoading,
    error: bookByGenreError,
    data: bookByGenreData
  } = useQuery(BOOK_BY_GENRE, {
    variables: { genre: selectedGenre },
    skip: !selectedGenre
  });

  if (!props.show) return null;
  if (loading || genresLoading || bookByGenresLoading) return <p>Loading...</p>;
  if (error || genresError || bookByGenreError)
    return <p>Error: {error ? error.message : genresError ? genresError.message : bookByGenreError.message}</p>;

  const books = data.allBooks;
  const genres = genresData.allGenres;
  const booksByGenre = bookByGenreData?.bookByGenre || [];
  const displayedBooks = selectedGenre ? booksByGenre : books;

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
          {displayedBooks.map((b) => (
            <tr key={b.id}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
              <td>{b.genres.join(", ")}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        {genres.map((g) => (
          <span key={g}>
            <button onClick={() => setSelectedGenre(g)}>
              {g}
            </button>
            &nbsp;
          </span>
        ))}
        <button onClick={() => setSelectedGenre(null)}>All genres</button>
      </div>
    </div>
  );
};

export default Books;
