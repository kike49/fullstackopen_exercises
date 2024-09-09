import { useDispatch, useSelector } from "react-redux"
import { voteAnecdote } from "../reducers/anecdoteReducer"

const AnecdoteList = () => {
  const dispatch = useDispatch()
  const anecdotes = useSelector(state => {
    if (state.filter === 'ALL') {
      return state.anecdotes
    } else {
      return state.anecdotes.filter(a => a.content.includes(state.filter))
    }
  })
  const sortedAnecdotes = [...anecdotes].sort((a, b) => b.votes - a.votes)

  return (
    <div>
      {sortedAnecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            <i>Votes: {anecdote.votes}</i>
            <br />
            <button onClick={() => dispatch(voteAnecdote(anecdote.id))}>Vote</button>
            <hr />
          </div>
        </div>
      ))}
    </div>
  )
}

export default AnecdoteList
