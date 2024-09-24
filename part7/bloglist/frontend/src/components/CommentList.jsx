import React from "react"

const CommentList = ({ comments }) => {
  return (
    <div className="container">
      <h4>Comments</h4>
      {comments.length === 0 ? (
        <p>No comments yet.</p>
      ) : (
        <ul>
          {comments.map((comment, index) => (
            <li key={index}>{comment.content}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default CommentList
