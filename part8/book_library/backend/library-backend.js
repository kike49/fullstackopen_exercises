const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { GraphQLError } = require("graphql");
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const Book = require("./models/book");
require("dotenv").config();
const MONGODB_URI = process.env.MONGODB_URI;
const jwt = require("jsonwebtoken");
const Author = require("./models/author");
const User = require("./models/user");

console.log("Connecting to", MONGODB_URI);
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("Error connection to MongoDB:", error.message);
  });

const typeDefs = `
  type Author {
    name: String!
    id: ID!
    born: Int
    bookCount: Int
  }
  
  type Book {
    title: String!
    published: Int!
    author: Author!
    id: ID!
    genres: [String!]!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
    me: User
  }

  type Mutation {
  addBook(
    title: String!
    author: String!
    published: Int!
    genres: [String!]!
  ): Book,
  editAuthor(
    name: String!
    setBornTo: Int!
  ): Author,
  createUser(
    username: String!
    favoriteGenre: String
  ): User
  login(
    username: String!
    password: String!
  ): Token
}

type User {
  username: String!
  favoriteGenre: [String]
  id: ID!
}

type Token {
  value: String!
}
`;

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      let filteredBooks = await Book.find({}).populate("author");
      if (args.author) {
        filteredBooks = filteredBooks.filter(
          (book) => book.author.name === args.author
        );
      }
      if (args.genre) {
        filteredBooks = filteredBooks.filter((book) =>
          book.genres.includes(args.genre)
        );
      }
      return filteredBooks;
    },
    allAuthors: async () => {
      const authors = await Author.find({});
      const authorsWithBookCount = await Promise.all(
        authors.map(async (author) => {
          const bookCount = await Book.countDocuments({ author: author._id });
          return {
            ...author.toObject(),
            bookCount: bookCount || 0
          };
        })
      );
      return authorsWithBookCount;
    },
    me: (root, args, context) => {
      return context.currentUser;
    }
  },
  Mutation: {
    addBook: async (root, args, context) => {
      const currentUser = context.currentUser;
      if (!currentUser) {
        throw new GraphQLError("Not authenticated", {
          extensions: {
            code: "BAD_USER_INPUT"
          }
        });
      }
      const existAuthor = await Author.findOne({ name: args.author });
      if (!existAuthor) {
        const newAuthor = new Author({ name: args.author });
        try {
          await newAuthor.save();
        } catch (error) {
          throw new GraphQLError("Saving author failed", {
            extensions: {
              code: "BAD_USER_INPUT",
              invalidArgs: args.author,
              error
            }
          });
        }
      }
      const authorForNewBook = await Author.findOne({ name: args.author });
      const newBook = new Book({ ...args, author: authorForNewBook._id });
      const uniqueGenres = [
        ...new Set([...currentUser.favoriteGenre, ...newBook.genres])
      ];
      currentUser.favoriteGenre = uniqueGenres;
      await currentUser.save();
      try {
        await newBook.save();
      } catch (error) {
        throw new GraphQLError("Saving book failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.title,
            error
          }
        });
      }
      return newBook.populate("author");
    },
    editAuthor: async (root, args) => {
      const existAuthor = await Author.findOne({ name: args.name });
      if (!existAuthor) {
        return null;
      }
      existAuthor.born = args.setBornTo;
      try {
        await existAuthor.save();
      } catch (error) {
        throw new GraphQLError("Saving date failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.setBornTo,
            error
          }
        });
      }
      return existAuthor;
    },
    createUser: async (root, args) => {
      const user = new User({ username: args.username });
      return user.save().catch((error) => {
        throw new GraphQLError("Creating new user failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.username,
            error
          }
        });
      });
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });
      if (!user || args.password !== "secret") {
        throw new GraphQLError("Wrong credentials", {
          extensions: {
            code: "BAD_USER_INPUT"
          }
        });
      }
      const userForToken = {
        username: user.username,
        id: user._id
      };
      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) };
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers
});

startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req, res }) => {
    const auth = req ? req.headers.authorization : null;
    if (auth && auth.startsWith("Bearer ")) {
      const decodedToken = jwt.verify(
        auth.substring(7),
        process.env.JWT_SECRET
      );
      const currentUser = await User.findById(decodedToken.id);
      return { currentUser };
    }
  }
}).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
