import { gql } from "@apollo/client";

export const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      born
      bookCount
    }
  }
`;

// this query accepts an author and genre as args on the backend to filter but is not implemented on the frontend
export const ALL_BOOKS = gql`
  query {
    allBooks {
      title
      published
      author {
        name
        id
        born
        bookCount
      }
      id
      genres
    }
  }
`;

export const CREATE_BOOK = gql`
  mutation createBook(
    $title: String!
    $published: Int!
    $author: String!
    $genres: [String!]!
  ) {
    addBook(
      title: $title
      published: $published
      author: $author
      genres: $genres
    ) {
      title
      published
      author {
        name
        id
        born
        bookCount
      }
      genres
      id
    }
  }
`;

export const EDIT_YEAR = gql`
  mutation editAuthor($name: String!, $setBornTo: Int!) {
    editAuthor(name: $name, setBornTo: $setBornTo) {
      name
      born
    }
  }
`;

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`;

export const ALL_GENRES = gql`
  query {
    allGenres
  }
`;

export const BOOK_BY_GENRE = gql`
  query bookByGenre($genre: String!) {
    bookByGenre(genre: $genre) {
      title
      published
      author {
        name
        id
        born
        bookCount
      }
      id
      genres
    }
  }
`;

// To display the filtered books for the user, just need to create another query that accepts an array of strings as args with the favoriteGenre list and filters the books included on it to display
export const ME = gql`
  query {
    me {
      username
      favoriteGenre
      id
    }
  }
`;

const BOOK_DETAILS = gql`
  fragment BookDetails on Book {
    title
    published
    author {
      name
      id
      born
      bookCount
    }
    id
    genres
  }
`;

export const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      ...BookDetails
    }
  }
  ${BOOK_DETAILS}
`;
