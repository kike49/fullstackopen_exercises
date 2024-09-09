import axios from "axios"

const baseUrl = "http://localhost:3001/anecdotes"

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const createNew = async (content) => {
  const object = { content, votes: 0 }
  const response = await axios.post(baseUrl, object)
  return response.data
}

const voteAnecdote = async (id) => {
  const response = await axios.get(`${baseUrl}/${id}`)
  const anecdoteToVote = response.data
  const updatedAnecdote = {
    ...anecdoteToVote,
    votes: anecdoteToVote.votes + 1
  }
  const votedResponse = await axios.put(`${baseUrl}/${id}`, updatedAnecdote)
  return votedResponse.data
}

export default { getAll, createNew, voteAnecdote }
