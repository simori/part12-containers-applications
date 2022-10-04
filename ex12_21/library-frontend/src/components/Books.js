import { useState } from 'react'
import { useQuery } from '@apollo/client'

import { GET_BOOKS, GET_GENRES } from '../queries'

const InGenre = ({genre}) => {
  if (!genre) {
    return null
  }
  return (
    <>
      <em>in genre <b>{genre}</b></em>
    </>
  )
}

const Books = (props) => {
  const [genre, setGenre] = useState()
  const getBooks = useQuery(GET_BOOKS, { variables: { genre: genre } })

  const getGenres = useQuery(GET_GENRES)

  if (!props.show) {
    return null
  }

  if (getBooks.loading || getGenres.loading) {
    return (
      <em>loading!</em>
    )
  }

  if (getBooks.data.allBooks.length === 0) {
    return(
      <><br/>
        no books in database!
      </>
    )
  }

  // react-versio filtteröinnistä
  //const books = props.allBooks
  const books = getBooks.data.allBooks
  const genList = getGenres.data.allBooks

  // jos genrellä jokin ei-null arvo, filtteröidään sen mukaan. muuten näytä kaikki kirjat
  const booksToShow = genre ? books.filter(b => b.genres.includes(genre)) : books

  //console.log('kirjat genressä', genre, ': (react versio)',booksToShow)

  // kerätään yhteen taulukkoon kaikki genret
  const genres = genList.map((b) => b.genres)
  let allGenres = []
  genres.forEach(g => {
    allGenres.push(...g)
  })

  const uniqueGenres = [...new Set(allGenres)]

  return (
    <div>
      <h2>books</h2>
      <InGenre genre={genre} />
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {booksToShow.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {uniqueGenres.map((g) => (
        <button key={g} onClick={() => setGenre(g)}>{g}</button>
      ))}
      <button onClick={() => setGenre(null)}>all genres</button>
    </div>
  )
}

export default Books
