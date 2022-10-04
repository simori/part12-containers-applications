import { gql } from '@apollo/client'


// tehtävä 8.8 
export const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      born
      bookCount
    }
  }
`

// tehtävä 8.26 
export const ALL_AUTHORS_826 = gql`
  query {
    allAuthors {
      name
      bookCount
    }
  }
`

// tehtävä 8.9 
export const GET_BOOKS = gql`
  query ($genre: String) {
    allBooks(genre: $genre) {
      title
      published
      author {
        name
      }
      genres
    }
  }
`

// tehtävä 8.21
export const GET_GENRES = gql`
  query {
    allBooks {
      genres
    }
  }
`

export const CREATE_BOOK = gql`
  mutation createBook($title: String!, $author: String!, $published: Int!, $genres: [String!]!) {
    addBook(
      title: $title,
      author: $author,
      published: $published,
      genres: $genres
    ) {
      title
      author {
        name
      }
      published
      genres
    }
  }
`

// 8.11
export const EDIT_AUTHOR = gql`
  mutation editAuthor($name: String!, $born: Int!) {
    editAuthor(name: $name, setBornTo: $born)  {
      name
      born
    }
  }
`

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password)  {
      value
    }
  }
`

export const ME = gql`
  query {
    me {
      username
      favoriteGenre
      id
    }
  }
`

// 8.23
export const BOOK_DETAILS = gql`
  fragment BookDetails on Book {
    title
    published
    author {
      name
    }
    genres
  }
`

// 8.24
export const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      ...BookDetails
    }
  }
  
${BOOK_DETAILS}
`