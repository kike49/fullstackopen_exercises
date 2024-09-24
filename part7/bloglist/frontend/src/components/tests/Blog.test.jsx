import { render, screen } from "@testing-library/react"
import Blog from "../Blog"
import userEvent from "@testing-library/user-event"
import { vi } from "vitest"
import blogService from "../../services/blogs"
vi.mock("../services/blogs")

// Exercise 4.13
test("Renders title and author but not URL or likes by default", () => {
  const blog = {
    title: "Component testing is done with react-testing-library",
    author: "React test",
    url: "www.test.com",
    likes: 5
  }

  const { container } = render(<Blog blog={blog} />)

  const blogHeader = container.querySelector(".blog-header")
  expect(blogHeader).toHaveTextContent(blog.title)
  expect(blogHeader).toHaveTextContent(blog.author)

  const detailsElement = container.querySelector(".blog-details")
  expect(detailsElement).toBeNull()
})

// Exercise 4.14
test("Details are shown once button is clicked", async () => {
  const blog = {
    title: "Component testing is done with react-testing-library",
    author: "React test",
    url: "www.test.com",
    likes: 5
  }

  const { container } = render(<Blog blog={blog} />)

  const user = userEvent.setup()
  const button = screen.getByText("Show")
  await user.click(button)

  const detailsElement = container.querySelector(".blog-details")
  expect(detailsElement).toHaveTextContent(blog.url)
  expect(detailsElement).toHaveTextContent(blog.likes)
})

// Exercise 4.15
test("Like button clicked twice and props received accordingly", async () => {
  const blog = {
    title: "Component testing is done with react-testing-library",
    author: "React test",
    url: "www.test.com",
    likes: 5
  }

  const mockHandler = vi.fn()
  blogService.update.mockResolvedValue({ ...blog, likes: blog.likes + 2 })
  render(<Blog blog={blog} updateBlog={mockHandler} />)

  const user = userEvent.setup()
  const showButton = screen.getByText("Show")
  await user.click(showButton)

  const likeButton = screen.getByText("Like")
  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)
  expect(blogService.update).toHaveBeenCalledTimes(2)
})
