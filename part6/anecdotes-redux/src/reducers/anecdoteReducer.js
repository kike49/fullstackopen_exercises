import { createSlice } from "@reduxjs/toolkit" // current to make human-readable the console logs of the state
import { setTimeMessage } from "./notificationReducer"
import anecdoteService from '../services/anecdotes'

const anecdoteSlice = createSlice({
  name: "anecdotes",
  initialState: [],
  reducers: {
    updateAnecdote(state, action) {
      const updatedAnecdote = action.payload
      return state.map(anecdote => 
        anecdote.id === updatedAnecdote.id ? updatedAnecdote : anecdote
      )
    },
    appendAnecdote(state, action) {
      state.push(action.payload)
    },
    setAnecdotes(state, action) {
      return action.payload
    }
  }
})

export const { updateAnecdote, appendAnecdote, setAnecdotes } = anecdoteSlice.actions

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const createAnecdote = content => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(appendAnecdote(newAnecdote))
    dispatch(setTimeMessage(`Voted for anecdote: "${newAnecdote.content}"`, 5000))
  }
}

export const voteAnecdote = id => {
  return async dispatch => {
    const anecdoteVoted = await anecdoteService.voteAnecdote(id)
    dispatch(updateAnecdote(anecdoteVoted))
    dispatch(setTimeMessage(`New anecdote added: "${anecdoteVoted.content}"`, 5000))
  }
}

export default anecdoteSlice.reducer
