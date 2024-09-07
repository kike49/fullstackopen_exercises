const { test, expect, beforeEach, describe } = require("@playwright/test")
const { createBlog } = require("./helper")

describe("Blog app", () => {
  beforeEach(async ({ page, request }) => {
    await request.post("http://localhost:3003/api/testing/reset") // Restart DB
    await request.post("http://localhost:3003/api/users", {
      data: {
        name: "User Test",
        username: "testUser",
        password: "testPassword"
      }
    }) // Creates an user
    await page.goto("http://localhost:5173") // Goes to the main page
  })
  // Exercise 5.17
  test("Login form shown by default", async ({ page }) => {
    const locator = await page.getByText("Log in")
    await expect(locator).toBeVisible()
  })
  describe("Login", () => {
    // Exercise 5.18
    test("Login correct", async ({ page }) => {
      await page.getByPlaceholder("username").fill("testUser")
      await page.getByPlaceholder("password").fill("testPassword")
      await page.getByRole("button", { name: "Login" }).click()
      await expect(page.getByText("logged in")).toBeVisible() // it will display the text after the username
    })
    // Exercise 5.18
    test("Login wrong credentials", async ({ page }) => {
      await page.getByPlaceholder("username").fill("wrongTestUser")
      await page.getByPlaceholder("password").fill("wrongTestPassword")
      await page.getByRole("button", { name: "Login" }).click()
      await expect(page.getByText("Log in")).toBeVisible() // it will display the form title again as log in was not successful
    })
    describe("User logged in", () => {
      beforeEach(async ({ page }) => {
        await page.getByPlaceholder("username").fill("testUser")
        await page.getByPlaceholder("password").fill("testPassword")
        await page.getByRole("button", { name: "Login" }).click() // test under this are already logged in
      })
      // Exercise 4.19
      test("Create a blog", async ({ page }) => {
        await createBlog(page)
        await expect(page.getByText("Title from helper -- by")).toBeVisible()
      })
      // Exercise 4.20
      test("Blog can be liked", async ({ page }) => {
        await createBlog(page)
        await page.getByRole("button", { name: "Show" }).click()
        await page.getByRole("button", { name: "Like" }).click()
        const likesText = await page.getByText("Likes: 1")
        await expect(likesText).toBeVisible()
      })
      // Exercise 4.21
      test("Blog can be deleted by its user", async ({ page }) => {
        await createBlog(page)
        await page.getByRole("button", { name: "Show" }).click()
        page.on("dialog", async (dialog) => {
          expect(dialog.type()).toBe("confirm")
          await dialog.accept()
        })
        await page.getByRole("button", { name: "Delete" }).click()
        await expect(page.getByText("Title from helper")).toBeHidden()
      })
      // Exercise 4.22
      test("Other user cannot see delete button", async ({ page, request }) => {
        await createBlog(page) // Creates blog with the logged user (testUser)
        await page.getByRole("button", { name: "Logout" }).click()
        // Creates an user
        await request.post("http://localhost:3003/api/users", {
          data: {
            name: "User Test2",
            username: "testUser2",
            password: "testPassword2"
          }
        })
        // Log in new user
        await page.getByPlaceholder("username").fill("testUser2")
        await page.getByPlaceholder("password").fill("testPassword2")
        await page.getByRole("button", { name: "Login" }).click()
        // Show details of post
        await page.getByRole("button", { name: "Show" }).click()
        // Delete button must not be there
        await expect(page.getByRole("button", { name: "Delete" })).toHaveCount(
          0
        )
      })
      // Exercise 4.23
      test("Blogs are sorted by likes", async ({ page }) => {
        const newBlog1 = {
          title: "First blog",
          author: "Playwright test",
          url: "www.playwright.com"
        }
        await createBlog(page, newBlog1)
        await page.getByRole("button", { name: "Show" }).click()
        await page.getByRole("button", { name: "Like" }).click() // gives a like to the blog 1
        await page.getByRole("button", { name: "Hide" }).click()
        const newBlog2 = {
          title: "Second blog",
          author: "Playwright test",
          url: "www.playwright.com"
        }
        await page.getByPlaceholder("Title").fill(newBlog2.title)
        await page.getByPlaceholder("Author").fill(newBlog2.author)
        await page.getByPlaceholder("URL").fill(newBlog2.url)
        await page.getByRole("button", { name: "Save" }).click() // creates the blog 2 manually as the form is already displayed
        const blogHeaders = await page.locator(".blog-header").allTextContents() // collects the title+author display in hide mode for both blogs
        expect(blogHeaders[0]).toContain(newBlog1.title) // this blog was created first
        await page.getByRole("button", { name: "Show" }).nth(1).click() // show details for like button of the second blog
        await page.getByRole("button", { name: "Like" }).click() // like few times the second blog
        await page.getByRole("button", { name: "Like" }).click()
        await page.getByRole("button", { name: "Like" }).click()
        await page.getByRole("button", { name: "Like" }).click()
        await page.getByRole("button", { name: "Hide" }).click()
        const blogHeadersAfterLikes = await page.locator(".blog-header").allTextContents() // collects the title+author for the new order (the second blog is liked more now)
        expect(blogHeadersAfterLikes[0]).toContain(newBlog2.title) // the blog created after and liked 4 times now is first
      })
    })
  })
})
