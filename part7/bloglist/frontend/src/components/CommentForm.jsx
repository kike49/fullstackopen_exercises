import React, { useState } from "react"

const CommentForm = ({ addComment, user }) => {
  const [comment, setComment] = useState("")
  const [author, setAuthor] = useState(user ? user.username : "")

  const handleSubmit = (event) => {
    event.preventDefault()
    addComment(comment, author)
    setComment("")
    if (!user) setAuthor("")
  }

  return (
    <form onSubmit={handleSubmit}>
      {!user && (
        <div className="container">
          <input
            type="text"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
            placeholder="Your name (optional)"
          />
        </div>
      )}
      <div className="container">
        <textarea
          value={comment}
          onChange={({ target }) => setComment(target.value)}
          placeholder="Write your comment here..."
          rows="3"
        />
      </div>
      <button type="submit">Add Comment</button>
    </form>
  )
}

export default CommentForm
