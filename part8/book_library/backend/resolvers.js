const { GraphQLError } = require("graphql");
const Book = require("./models/book");
const jwt = require("jsonwebtoken");
const Author = require("./models/author");
const User = require("./models/user");
const { PubSub } = require("graphql-subscriptions");
const pubsub = new PubSub();

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
    allGenres: async () => {
      const books = await Book.find({});
      const genres = [...new Set(books.flatMap((book) => book.genres))];
      return genres;
    },
    bookByGenre: async (root, args) => {
      if (!args.genre) {
        return Book.find({});
      }
      return await Book.find({ genres: { $in: [args.genre] } }).populate(
        "author"
      );
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
      pubsub.publish('BOOK_ADDED', { bookAdded: newBook })
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
  },
  Subscription: {
    bookAdded: {
        subscribe: () => pubsub.asyncIterator('BOOK_ADDED')
    }
  }
};

module.exports = resolvers;
