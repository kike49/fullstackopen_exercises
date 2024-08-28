import { useState } from "react"

const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>

const Display = ({ title, anecdote, votes }) => {
  return (
    <>
      <h1>{title}</h1>
      <div>{anecdote}</div>
      <div><i>Has {votes} vote(s)</i></div>
    </>
  )
}

const App = () => {
  const anecdotes = [
    "If it hurts, do it more often.",
    "Adding manpower to a late software project makes it later!",
    "The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    "Premature optimization is the root of all evil.",
    "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
    "Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.",
    "The only way to go fast, is to go well.",
  ]

  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(new Array(anecdotes.length).fill(0))

  const randomAnecdote = () => setSelected(getRandomInt(0, anecdotes.length))

  const voteAnecdote = () => {
    const votesCopy = [...votes]
    votesCopy[selected] += 1
    setVotes(votesCopy)
  }

  const mostVotedIndex = votes.indexOf(Math.max(...votes))

  function getRandomInt(min, max) {
    const minCeiled = Math.ceil(min)
    const maxFloored = Math.floor(max)
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled)
  }

  return (
    <>
      <Display title="Anecdote of the day" anecdote={anecdotes[selected]} votes={votes[selected]} />
      <Button onClick={voteAnecdote} text="Vote" />
      <Button onClick={randomAnecdote} text="Next anecdote" />
      <Display title="Anecdote with most votes" anecdote={anecdotes[mostVotedIndex]} votes={votes[mostVotedIndex]} />
    </>
  )
}

export default App
