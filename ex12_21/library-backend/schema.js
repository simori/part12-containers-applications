const { gql } = require('apollo-server')

const typeDefs = gql`
  type Subscription {
    bookAdded: Book!
  }  

	type Mutation {
		createUser(username: String!, favoriteGenre: String!): User

		login(username: String!, password: String!): Token

		addBook(
			title: String!
			author: String!
			published: Int!
			genres: [String!]!
		): Book

		editAuthor(name: String!, setBornTo: Int!): Author
	}

	type User {
		username: String!
		favoriteGenre: String!
		id: ID!
	}

	type Token {
		value: String!
	}

	type Book {
		title: String!
		published: Int!
		author: Author!
		genres: [String!]!
		id: ID!
	}

	type Author {
		name: String!
		born: Int
		bookCount: Int
	}

	type Query {
		bookCount: Int!
		authorCount: Int!
		allBooks(author: String, genre: String): [Book!]!
		allAuthors: [Author!]!
		me: User
	}
`

module.exports = typeDefs