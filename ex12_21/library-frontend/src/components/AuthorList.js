const AuthorList = ({authors, show}) => {

  if (!show) {
    return null
  }

  if (authors.length === 0) {
    return(
      <>
        no authors in database!
      </>
    )
  }
  return (
    <>
    <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

export default AuthorList