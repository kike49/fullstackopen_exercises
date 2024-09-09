import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createAnecdote } from "../services/request"
import { useSetNotification } from "../context/NotificationContext"

const AnecdoteForm = () => {
  const queryClient = useQueryClient()
  const setNotification = useSetNotification()

  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: (newAnecdote) => {
      queryClient.invalidateQueries({ queryKey: ["anecdotes"] })
      setNotification(`New anecdote "${newAnecdote.content}" created!`, 5000)
    },
    onError: (error) => {
      setNotification(error.response.data.error, 5000)
    }
  })
  const onCreate = async (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ""
    newAnecdoteMutation.mutate({ content: content, votes: 0 })
  }

  return (
    <div>
      <h3>Create new</h3>
      <form onSubmit={onCreate}>
        <input name="anecdote" />
        <button type="submit">Create</button>
      </form>
      <hr />
    </div>
  )
}

export default AnecdoteForm
