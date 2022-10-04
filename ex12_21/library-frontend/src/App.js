import { useState } from 'react'
import { useApolloClient, useSubscription, useQuery } from '@apollo/client/react'
import Authors from './components/Authors'
import AuthorList from './components/AuthorList'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Login from './components/Login'
import Recommend from './components/Recommend'
import { ALL_AUTHORS, GET_BOOKS, BOOK_ADDED, GET_GENRES, ALL_AUTHORS_826 } from './queries'

const Notify = ({errorMessage}) => {
  if ( !errorMessage ) {
    return null
  }
  return (
    <div style={{color: 'red'}}>
      {errorMessage}
    </div>
  )
}

const App = () => {
	const [page, setPage] = useState('authorlist')
  const [token, setToken] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  const client = useApolloClient()

  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
  }

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  // otetaan täällä frontissa tilaus käyttöön, näytetään alertilla viesti
  // kun uusi kirja tulee lisätyksi
  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const addedBook = subscriptionData.data.bookAdded
      // 8.25
      client.cache.updateQuery({ query: GET_BOOKS }, ({ allBooks }) => {
        return {
          allBooks: allBooks.concat(addedBook),
        }
      })
      
      client.cache.updateQuery({ query: GET_GENRES }, ({ allBooks }) => {
          return {
            allBooks: allBooks.concat(addedBook.genres),
            genres: addedBook.genres
          }
        }
      )
      alert(`Added book ${addedBook.title} by ${addedBook.author.name}!`)
    }
  })

	// tehtävä 8-8
	const allAuthorsQuery = useQuery(ALL_AUTHORS, {
    fetchPolicy: 'cache-and-network'
  })
	
	// tehtävä 8-9
	const allBooksQuery = useQuery(GET_BOOKS, {
    fetchPolicy: 'cache-and-network'
  })

  // 8.26
  const allAuth826 = useQuery(ALL_AUTHORS_826)
  console.log('8.26',allAuth826)

	if (allAuthorsQuery.loading || allBooksQuery.loading) {
		return <div>loading...</div>
	}

	const authors = allAuthorsQuery.data.allAuthors
	const books = allBooksQuery.data.allBooks 

  if (!token) {
    return (
      <div>
        <Notify errorMessage={errorMessage} />
        <button onClick={() => setPage('authorlist')}>authors</button>
				<button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('login')}>login</button>
        <AuthorList show={page === 'authorlist'} authors={authors} />
			  <Books show={page === 'books'} allBooks={books} />
        <Login
          show={page === 'login'}
          setToken={setToken}
          setError={notify}
        />
      </div>
    )
  }

	return (
		<div>
			<div>
				<button onClick={() => setPage('authors')}>authors</button>
				<button onClick={() => setPage('books')}>books</button>
				<button onClick={() => setPage('add')}>add book</button>
        <button onClick={() => setPage('recommend')}>recommend</button>
        <button onClick={logout}>logout</button>
			</div>

			<Authors show={page === 'authors'} allAuthors={authors} />
			<Books show={page === 'books'} allBooks={books} />
			<NewBook show={page === 'add'} />
      <Recommend show={page === 'recommend'} allBooks={books} />
      
		</div>
	)
}

export default App

