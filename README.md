# W4156 Project Front End

## Usage
Install dependencies: `npm install`


First, make sure that our [backend service](https://github.com/serdarmt/w4156-project) is running.

Then start by running `npm run devStart`

- `/login`: goes to the login page
- `/`: the home page should display all schedules stored in the database
- `/create`: currently for demo purpose

## Tooling

- Vite + React

- React Router DOM

- Axios

- Tailwind CSS

- [Prettier](https://prettier.io)

- VS Code extensions
    - Prettier - Code formatter
        - you can configure it to auto-format on save. this can
        be language specific, eg. only enabled for JS.
        - alternatively, you can manually invoke the Command Pallete and let it format the selected code only
    - Tailwind CSS IntelliSense
        - this helps you write the `className=` with suggestions
        - when hovering on a CSS class name, it shows the CSS code
    - ES7+ React/Redux/React-Native snippets
