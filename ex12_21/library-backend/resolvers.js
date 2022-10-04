const { UserInputError, AuthenticationError } = require('apollo-server')
const jwt = require('jsonwebtoken')
const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')
const JWT_SECRET = 'NEED_HERE_A_SECRET_KEY'

const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()

const resolvers = {
	Mutation: {
		addBook: async (root, args, { currentUser }) => {
			if (!currentUser) {
				throw new AuthenticationError('not authenticated!')
			}

			const seekBook = await Book.findOne({ title: args.title })

			if (seekBook) {
				throw new UserInputError(`${args.title} already exists in database!`, {
					invalidArgs: args.name
				})
			}

			// 8.15 kirjan nimen validointi
			if (args.title.length < 2) {
				if (args.title.length == 0) {
					throw new UserInputError('Book title is required!', {
						invalidArgs: args.name
					})
				}
				throw new UserInputError(
					'Too short book name! Name must be at least 2 characters lenght!',
					{
						invalidArgs: args.name
					}
				)
			}

			const newAuthor = new Author({
				name: args.author,
				born: null,
				bookCount: 1
			})

			// 8.15 authorin nimen validointi
			if (newAuthor.name.length < 4) {
				if (newAuthor.name.length == 0) {
					throw new UserInputError('Author name is required!', {
						invalidArgs: args.name
					})
				}
				throw new UserInputError(
					'Too short author name! Must be at least 4 characters!',
					{
						invalidArgs: args.name
					}
				)
			}

			const findAuthor = await Author.findOne({ name: args.author })
			// jos kirjoittajaa ei ole ennestään tiedoissa:
			if (!findAuthor) {
				try {
					await newAuthor.save()
					const book = new Book({ ...args, author: newAuthor })
					await book.save()

          // 8.24
          // julkaistaan tilanneille tieto lisäyksestä
          pubsub.publish('BOOK_ADDED', { bookAdded: book })

					return book
				} catch (error) {
					throw new UserInputError(error.message, {
						invalidArgs: args
					})
				}
			}

			// jos authori löytyi jo
			const book = new Book({ ...args, author: findAuthor })

			try {
				await book.save()
        
			} catch (error) {
				throw new UserInputError(error.message, {
					invalidArgs: args
				})
			}
      // julkaistaan tilanneille tieto lisäyksestä
      pubsub.publish('BOOK_ADDED', { bookAdded: book }) 
			return book
		},
		editAuthor: async (root, args, { currentUser }) => {
			// 8.16
			//const currentUser = context.currentUser
			
			if (!currentUser) {
				throw new AuthenticationError('not authenticated!')
			}
			// jos authoria ei löydy, palauta null
			//console.log('editAuthor root,', root, 'args', args)
			try {
				const author = await Author.findOneAndUpdate(
					{ name: args.name },
					{ born: args.setBornTo }
				)
        return author
			} catch (error) {
        console.log('FAIL')
				throw new UserInputError(error.message, {
					invalidArgs: args
				})
			}

			/*       const updatedAuthor = { ...author, born: args.setBornTo }
      await updatedAuthor.save() */
			return author
		},
		createUser: (root, args) => {
			const user = new User({
				username: args.username,
				favoriteGenre: args.favoriteGenre
			})

			// 8.15 validointi
			if (args.username.length < 2) {
				throw new UserInputError(
					'Too short username! Must be at least 2 characters!',
					{
						invalidArgs: args
					}
				)
			}
			if (!args.favoriteGenre) {
				throw new UserInputError('Favorite genre is required!', {
					invalidArgs: args
				})
			}

			return user.save().catch((error) => {
				throw new UserInputError(error.message, {
					invalidArgs: args
				})
			})
		},
		login: async (root, args) => {
			const user = await User.findOne({ username: args.username })

			if (!user || args.password !== 'password') {
				throw new UserInputError('wrong credentials!')
			}

			const userForToken = {
				username: user.username,
				id: user._id
			}

			return { value: jwt.sign(userForToken, JWT_SECRET) }
		}
	},
  // subskriptio tehtävä 8.23
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator(['BOOK_ADDED'])
    },
  },
	Query: {
		// tehtävä 8.1
		bookCount: async () => Book.collection.countDocuments(),
		authorCount: () => Author.collection.countDocuments(),
		// tehtävä 8.2 & 8.4
		allBooks: async (root, args) => {
			//const authors = await Author.find({})
			//console.log('authorss', authors)
			if (args.author && args.genre) {
				// jos nimi ja genre molemmat annettu, filtteröidään
				const auth = await Author.find({ name: args.author })
				//const booksByGen = await Book.find({genres: args.genre})
				const booksByAuth = await Book.find({ author: auth })

				const filtered = booksByAuth.filter((b) =>
					b.genres.includes(args.genre)
				)
				return filtered
			}
			// ei filtteröintiä
			else if (!args.genre && !args.author) {
				const books = await Book.find({})
				//const list = await Book.find({})
				return books
			}
			// nimeä ei annettu mutta genre on annettu
			else if (!args.author) {
				const books = await Book.find({ genres: args.genre })
				return books
			} else if (!args.genre) {
          const findAuth = await Author.find({ name: args.author })
          const books = await Book.find({ author: findAuth })
          return books
			}
		},
		// tehtävä 8.3
		allAuthors: async () => {
      console.log('allAuthors kutsuttu')
			return await Author.find({})
		},
		me: (root, args, context) => {
			return context.currentUser
		}
	},
	// tehtävä 8.3 resolveri bookCountille!
	Author: {
    
		bookCount: async (root) => {
			const books = await Book.find({ author: root._id })
			return books.length
		},
		name: async (root) => {
			const author = await Author.findById(root)
			return author.name
		}
	}
}

module.exports = resolvers