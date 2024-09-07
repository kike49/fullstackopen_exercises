import { render, screen } from "@testing-library/react"
import BlogForm from "./BlogForm"
import userEvent from "@testing-library/user-event"
import { vi } from "vitest"
vi.mock("../services/blogs")

// Exercise 4.16
test("Blog form calls event handler from props with details", async () => {
  const createBlog = vi.fn()
  const user = userEvent.setup()
  render(<BlogForm createBlog={createBlog} />)

  const titleInput = screen.getByPlaceholderText("Title")
  const authorInput = screen.getByPlaceholderText("Author")
  const urlInput = screen.getByPlaceholderText("URL")
  const saveButton = screen.getByText("Save")

  await user.type(titleInput, "Title test")
  await user.type(authorInput, "Author test")
  await user.type(urlInput, "Mock URL")
  await user.click(saveButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe("Title test")
  expect(createBlog.mock.calls[0][0].author).toBe("Author test")
  expect(createBlog.mock.calls[0][0].url).toBe("Mock URL")
})
