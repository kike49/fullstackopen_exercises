import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [newBlog, setNewBlog] = useState({ title: '', author: '', url: '' })

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: newBlog.title,
      author: newBlog.author,
      url: newBlog.url
    })
    setNewBlog({ title: '', author: '', url: '' })
  }
  const handleNewBlog = (event) => {
    const { name, value } = event.target
    setNewBlog({ ...newBlog, [name]: value })
  }
  return (
    <form onSubmit={addBlog}>
    Title <input name="title" value={newBlog.title} placeholder="Title" onChange={handleNewBlog} />
      <br />
    Author <input name="author" value={newBlog.author} placeholder="Author" onChange={handleNewBlog} />
      <br />
    URL <input name="url" value={newBlog.url} placeholder="URL" onChange={handleNewBlog} />
      <br />
      <button type="submit">Save</button>
    </form>
  )
}

export default BlogForm
