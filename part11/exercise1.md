Let us assume that the application is coded with some other language than JavaScript/TypeScript, e.g. in Python, Java, or Ruby. You can freely pick the language. This might even be a language you do not know much yourself. Write a short text, say 200-300 words, where you answer or discuss some of the points below. You can check the length with https://wordcounter.net/. Save your answer to the file named exercise1.md in the root of the repository that you shall create in exercise 11.2.

The points to discuss:

+ Some common steps in a CI setup include linting, testing, and building. What are the specific tools for taking care of these steps in the ecosystem of the language you picked? You can search for the answers by Google.

In the Python ecosystem, for linting, tools like **Pylint** and **Flake8** are widely used. These tools analyze Python code for errors and style violations, promoting a consistent coding style across the codebase. For testing, the **unittest** framework is built into Python and is often used in conjunction with **pytest**, a powerful testing tool that simplifies writing and running tests. Finally, for building and packaging applications, **setuptools** is a standard choice, allowing developers to create distributable Python packages. Also **poetry** is gaining popularity recently.


+ What alternatives are there to set up the CI besides Jenkins and GitHub Actions? Again, you can ask Google!

While Jenkins and GitHub Actions are popular CI/CD tools, there are alternatives such as **Travis CI**, which integrates seamlessly with GitHub repositories, and **CircleCI**, known for its speed and configurability. Another option is **GitLab CI**, which provides a built-in CI/CD tool within the GitLab platform, offering comprehensive integration with GitLab repositories. Lately, **Netlify** provides CI/CD tools as well for code along with the cloud based platforms like **AWS**, **GCP** and **Azure** that also provide the environment configuration and CI/CD tools.


+ Would this setup be better in a self-hosted or a cloud-based environment? Why? What information would you need to make that decision?

Considering the size of the team is relatively small and the project has not specific requirements, a cloud-based environment will do the job for us. The necessity of not setting the configuration and just paying for the service while using it, are decisive advantages for this choice. We will need to consider the future developments of the project and its budget, as well as the scalability of the application being developed.