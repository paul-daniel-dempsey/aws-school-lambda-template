# Useful nx commands!

**Note** if you have not installed nx globally, then prefix `npx` onto any of the below commands.

E.g. `nx g @nrwl/node:app somename` -> `npx nx g @nrwl/node:app somename`

All of the below commands should be run in a terminal from the root of the repo,
i.e. the same directory as `package.json`.

### Add (generate) a new lambda function to the project

`nx g @nrwl/node:app my-lambda-name`

This should generate boilerplate code under `packages/my-lambda-name`.
