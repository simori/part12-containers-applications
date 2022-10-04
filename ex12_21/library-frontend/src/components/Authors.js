import { useState, useEffect } from "react"
import { useMutation } from "@apollo/client/react/hooks"
import { EDIT_AUTHOR, ALL_AUTHORS } from "../queries"
import AuthorList from "./AuthorList"

const Authors = (props) => {
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')

  const [ changeAuthor, result ] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [ { query: ALL_AUTHORS } ],
    onError: (error) => {
      console.log(error)
      alert(`EpäOnnistui koska: ${error}`)
    }
  })

  const authors = props.allAuthors

  useEffect(() => {
    if (result.data && result.data.editAuthor === null) {
      alert('Failed to set birthyear because no such person found!')
    }
  }, [result.data]) // eslint-disable-line 

  useEffect(() => {
    if (authors.length > 0) {
      setName(authors[0].name)
    }
  }, []) // eslint-disable-line 

  if (!props.show) {
    return null
  }

  if (authors.length === 0) {
    return(
      <><br/>
        no authors in database!
      </>
    )
  }

  const submit = async (event) => {
    event.preventDefault()

    changeAuthor({ variables: { name, born } })

    setName('')
    setBorn('')
  }

  const handleChange = (event) => {
    setName(event.target.value)
  }

  return (
    <div>
      <AuthorList authors={authors} show={true}/>

      <h2>Set birthyear</h2>
      <form onSubmit={submit}>
        <select value={name} onChange={handleChange}>
          {authors.map((a) => (
            <option key={a.name} value={a.name}>{a.name}</option>
          ))}
        </select>
        
        <div>
          born
          <input
            value={born}
            onChange={({ target }) => setBorn(Number(target.value))}
          />
        </div>
        
        <button type="submit">update author!</button>
      </form>
    </div>
  )
}

export default Authors
