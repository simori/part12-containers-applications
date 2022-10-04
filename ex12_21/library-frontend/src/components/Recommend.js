import { ME } from '../queries'
import { useQuery } from '@apollo/client/react'

const Recommend = (props) => {
  
  // haetaan kirjautuneen käyttäjän tiedot
  const getMe = useQuery(ME)
  
  if (!props.show) {
    return null
  }

  const myFavGenre = getMe.data.me.favoriteGenre
  const booksToShow = props.allBooks.filter(b => b.genres.includes(myFavGenre))

  return (
    <>
      <h2>recommendations</h2>
      recommended books for you in your favorite genre <b>{myFavGenre}</b>
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
    </>
  )
}

export default Recommend