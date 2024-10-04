import { useState } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_BOOK, ALL_AUTHORS, ALL_BOOKS, ALL_GENRES} from "../queries";

const NewBook = (props) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [published, setPublished] = useState("");
  const [genre, setGenre] = useState("");
  const [genres, setGenres] = useState([]);
  const [createBook] = useMutation(CREATE_BOOK, {
    refetchQueries: [{ query: ALL_BOOKS }, { query: ALL_AUTHORS }, { query: ALL_GENRES }]
  });

  if (!props.show) {
    return null;
  }

  const submit = async (event) => {
    event.preventDefault();
    createBook({ variables: { title, published: parseInt(published), author, genres } });
    setTitle("");
    setPublished("");
    setAuthor("");
    setGenres([]);
    setGenre("");
  };

  const addGenre = () => {
    if (genre && !genres.includes(genre)) {
      setGenres(genres.concat(genre));
      setGenre("");
    }
  };

  return (
    <div>
      <h2>Add new book</h2>
      <form onSubmit={submit}>
        <div>
          Title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          Author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          Publish date
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(target.value)
            }
          />
        </div>
        <div>
          <button onClick={addGenre} type="button">
            Add genre
          </button>
          <input
            value={genre}
            placeholder="Add new genres here..."
            onChange={({ target }) => setGenre(target.value)}
          />
        </div>
        <div>Genres: {genres.join(", ")}</div>
        <br />
        <button type="submit">Create book</button>
      </form>
    </div>
  );
};

export default NewBook;
