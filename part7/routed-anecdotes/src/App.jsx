import { useState } from "react"
import { Routes, Route, Link, useNavigate, useMatch } from "react-router-dom"
import { useField } from "./hooks"

const Menu = () => {
  const padding = {
    paddingRight: 5
  }
  return (
    <div className="container">
      <Link style={padding} to="/">Anecdotes</Link>
      <Link style={padding} to="/create">Create anecdote</Link>
      <Link style={padding} to="/about">About</Link>
    </div>
  )
}

const Anecdotes = ({ anecdotes }) => {
  return (
    <div className="container">
    <h2>Anecdotes</h2>
    <ul>
      {anecdotes.map((anecdote) => (
        <li key={anecdote.id}>
          <Link to={`/anecdotes/${anecdote.id}`}>{anecdote.content}</Link>
        </li>
      ))}
    </ul>
  </div>
  )
}

const Anecdote = ({ anecdote }) => {
  return (
    <div className="container">
      <h3>{anecdote.content}</h3>
      <div className="container">Votes: {anecdote.votes}</div>
      <div className="container">Author: <i>{anecdote.author}</i></div>
      <div className="container">Link: <u>{anecdote.info}</u></div>
    </div>
  )
}

const About = () => (
  <div className="container">
    <h2>About anecdote app</h2>
    <p>According to Wikipedia:</p>

    <em>
      An anecdote is a brief, revealing account of an individual person or an
      incident. Occasionally humorous, anecdotes differ from jokes because their
      primary purpose is not simply to provoke laughter but to reveal a truth
      more general than the brief tale itself, such as to characterize a person
      by delineating a specific quirk or trait, to communicate an abstract idea
      about a person, place, or thing through the concrete details of a short
      narrative. An anecdote is "a story with a point."
    </em>

    <p>
      Software engineering is full of excellent anecdotes, at this app you can
      find the best and add more.
    </p>
  </div>
)

const Footer = () => (
  <div className="container">
    <br />
    <i>
      Anecdote app for <a href="https://fullstackopen.com/">Full Stack Open</a>. See{" "} <a href="https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js">here</a>{" "} for the source code.
    </i>

  </div>
)

const CreateNew = ({ addNew, setNotification }) => {
  const { inputs: content, reset: resetContent } = useField('text')
  const { inputs: author, reset: resetAuthor } = useField('text')
  const { inputs: info, reset: resetInfo } = useField('text')
  const navigate = useNavigate()
  const handleSubmit = (e) => {
    e.preventDefault()
    addNew({
      content: content.value,
      author: author.value,
      info: info.value,
      votes: 0
    })
    setNotification(`A new anecdote "${content.value}" was created successfully`)
    setTimeout(() => {setNotification('')}, 5000)
    navigate('/')
  }
  const handleReset = () => {
    resetContent()
    resetAuthor()
    resetInfo()
  }

  return (
    <div className="container">
      <h2>Create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div className="container">
          Content <input {...content}/>
        </div>
        <div className="container">
          Author <input {...author}/>
        </div>
        <div className="container">
          URL for more info <input {...info}/>
        </div>
        <button>Create</button>
        <button type="button" onClick={handleReset}>Reset</button>
      </form>
    </div>
  )
}

const Notification = ({ message }) => {
  return (
    (message &&
      <div style={{ border: "1px solid", backgroundColor: "yellow", padding: 10 }}>
        {message}
      </div>
    )
  )
}

const App = () => {
  const [anecdotes, setAnecdotes] = useState([
    {
      content: "If it hurts, do it more often",
      author: "Jez Humble",
      info: "https://martinfowler.com/bliki/FrequencyReducesDifficulty.html",
      votes: 0,
      id: 1
    },
    {
      content: "Premature optimization is the root of all evil",
      author: "Donald Knuth",
      info: "http://wiki.c2.com/?PrematureOptimization",
      votes: 0,
      id: 2
    }
  ])
  const [notification, setNotification] = useState("")
  const addNew = (anecdote) => {
    anecdote.id = Math.round(Math.random() * 10000)
    setAnecdotes(anecdotes.concat(anecdote))
  }
  const anecdoteById = (id) => anecdotes.find((a) => a.id === id)
  const vote = (id) => {
    const anecdote = anecdoteById(id)
    const voted = {
      ...anecdote,
      votes: anecdote.votes + 1
    }
    setAnecdotes(anecdotes.map((a) => (a.id === id ? voted : a)))
  }
  const match = useMatch('/anecdotes/:id')
  const anecdote = match ? 
    anecdotes.find(a => a.id === Number(match.params.id))
    : null
  return (
      <div className="container">
        <h1>Software anecdotes</h1>
        <Menu />
        <Notification message={notification} />
        <Routes>
          <Route path="/anecdotes/:id" element={<Anecdote anecdote={anecdote} />} />
          <Route path="/" element={<Anecdotes anecdotes={anecdotes} />} />
          <Route path="/create" element={<CreateNew addNew={addNew} setNotification={setNotification}/>} />
          <Route path="/about" element={<About />} />
        </Routes>
      <Footer />
    </div>
  )
}

export default App
