import { useQuery, useMutation, useQueryClient } from "react-query"
import blogService from "../services/blogs"

export const useBlogQueries = () => {
  const queryClient = useQueryClient()
  const blogsQuery = useQuery("blogs", blogService.getAll)
  const newBlogMutation = useMutation(blogService.create, {
    onSuccess: (newBlog) => {
      const blogs = queryClient.getQueryData("blogs") || []
      queryClient.setQueryData("blogs", [...blogs, newBlog])
    }
  })

  const updateBlogMutation = useMutation(
    ({ id, newObject }) => blogService.update(id, newObject),
    {
      onSuccess: (updatedBlog) => {
        const blogs = queryClient.getQueryData("blogs") || []
        const updatedBlogs = blogs.map((blog) =>
          blog.id === updatedBlog.id ? updatedBlog : blog
        )
        queryClient.setQueryData("blogs", updatedBlogs)
      }
    }
  )

  const deleteBlogMutation = useMutation(blogService.remove, {
    onSuccess: (_, id) => {
      const blogs = queryClient.getQueryData("blogs") || []
      const updatedBlogs = blogs.filter((blog) => blog.id !== id)
      queryClient.setQueryData("blogs", updatedBlogs)
    }
  })

  const fetchBlog = async (id) => {
    const blog = await blogService.getOne(id)
    queryClient.setQueryData(["blog", id], blog)
    return blog
  }

  const addCommentMutation = useMutation(
    ({ blogId, content, author }) =>
      blogService.addComment(blogId, content, author),
    {
      onSuccess: (newComment, { blogId }) => {
        queryClient.setQueryData(["comments", blogId], (oldComments = []) => [
          ...oldComments,
          newComment
        ])
      }
    }
  )

  const fetchComments = async (blogId) => {
    return await blogService.getComments(blogId)
  }

  return {
    blogs: blogsQuery.data || [],
    isLoading: blogsQuery.isLoading,
    isError: blogsQuery.isError,
    createBlog: newBlogMutation.mutate,
    updateBlog: updateBlogMutation.mutate,
    deleteBlog: deleteBlogMutation.mutate,
    fetchBlog,
    deleteBlogMutation,
    addComment: addCommentMutation.mutate,
    fetchComments
  }
}
