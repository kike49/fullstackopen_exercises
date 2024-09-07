// Helpers for the tests

const createBlog = async (page, data = {
    title: "Title from helper",
    author: "Playwright test",
    url: "www.playwright.com"
  }) => {
  await page.getByRole("button", { name: "New blog" }).click()
  await page.getByPlaceholder("Title").fill(data.title)
  await page.getByPlaceholder("Author").fill(data.author)
  await page.getByPlaceholder("URL").fill(data.url)
  await page.getByRole("button", { name: "Save" }).click()
}

export { createBlog }
