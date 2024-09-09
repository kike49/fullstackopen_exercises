import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import AnecdoteForm from "./components/AnecdoteForm"
import Notification from "./components/Notification"
import { getAnecdotes, updateAnecdote } from "./services/request"
import { useSetNotification } from "./context/NotificationContext"

const App = () => {
  const queryClient = useQueryClient()
  const setNotification = useSetNotification()

  const result = useQuery({
    queryKey: ["anecdotes"],
    queryFn: getAnecdotes,
    refetchOnWindowFocus: false
  })

  const updateAnecdoteMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: (updatedAnecdote) => {
      queryClient.invalidateQueries({ queryKey: ["anecdotes"] })
      setNotification(`Anecdote "${updatedAnecdote.content}" voted!`, 5000)
    }
  })

  const handleVote = (anecdote) => {
    updateAnecdoteMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 })
  }

  if (result.isLoading) {
    return <div>Loading data...</div>
  }

  if (result.isError) {
    return (
      <div>Anecdote service not available due to problems in the server</div>
    )
  }

  const anecdotes = result.data

  return (
    <div>
      <h1>Anecdote app</h1>
      <Notification />
      <AnecdoteForm />
      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            Votes: {anecdote.votes}
            <br />
            <button onClick={() => handleVote(anecdote)}>Vote</button>
          </div>
          <hr />
        </div>
      ))}
    </div>
  )
}

export default App
