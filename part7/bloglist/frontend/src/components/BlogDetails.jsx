import React, { useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useUser } from "../context/UserContext"
import { useBlogQueries } from "../hooks/useBlogQueries"
import Blog from "./Blog"
import CommentForm from "./CommentForm"
import CommentList from "./CommentList"
import { useQuery } from "react-query"

const BlogDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, checkLoggedUser } = useUser()
  const {
    blogs,
    isLoading,
    updateBlog,
    deleteBlog,
    deleteBlogMutation,
    addComment,
    fetchComments
  } = useBlogQueries()

  const { data: comments = [], refetch: refetchComments } = useQuery(
    ["comments", id],
    () => fetchComments(id),
    { enabled: !!id }
  )

  useEffect(() => {
    checkLoggedUser()
  }, [])

  useEffect(() => {
    if (deleteBlogMutation.isSuccess) {
      navigate("/")
    }
  }, [deleteBlogMutation.isSuccess, navigate])

  const blogToShow = blogs.find((blog) => blog.id === id)

  if (isLoading || !blogToShow) {
    return <div className="container">Loading...</div>
  }

  const handleDeleteBlog = (blogId) => {
    if (window.confirm(`Do you want to delete the blog?`)) {
      deleteBlog(blogId)
    }
  }

  const handleAddComment = async (content, author) => {
    await addComment({ blogId: id, content, author })
    refetchComments()
  }

  return (
    <>
      <div className="container">
        <h3>Blog details</h3>
        <Blog
          key={blogToShow.id}
          blog={blogToShow}
          updateBlog={updateBlog}
          deleteBlog={handleDeleteBlog}
          currentUser={user}
        />
        <CommentList comments={comments} />
        <CommentForm addComment={handleAddComment} user={user} />
      </div>
    </>
  )
}

export default BlogDetails
