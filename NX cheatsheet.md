# Useful nx commands!

**Note** if you have not installed nx globally, then prefix `npx` onto any of the below commands.

E.g. `nx g @nrwl/node:app somename` -> `npx nx g @nrwl/node:app somename`

All of the below commands should be run in a terminal from the root of the repo,
i.e. the same directory as `package.json`.

## Add (generate) a new lambda function to the project

### Step one

`nx g @nrwl/node:app my-lambda-name --bundler=webpack`

This should generate boilerplate code under `packages/my-lambda-name`.

### Step two
You need to edit the `project.json` file in the newly generated package.
- Rename the existing `"build"` key under `"targets"` to `"transpile"`.
- Add the value `"externalDependencies": "none"` to the `"options"` object under `"transpile"`

### Step three
Add the following json object under `"targets"`:
```
"build": {
  "executor": "nx:run-commands",
  "options": {
    "commands": [
      "zip -r ../my-lambda-name.zip *"
    ],
    "cwd": "dist/packages/my-lambda-name"
  },
  "dependsOn": [{
    "projects": "self",
    "target": "transpile"
  }
  ]
},
```

### Step four - test it

Run `npm rum build` from the root directory. You should see a
zipfile generated under `dist/packages`; it'll be called `my-lambda-name.zip`

Running `unzip -l dist/packages/my-lambda-name.zip` should give you something like this:
```
Archive:  dist/packages/my-lambda-name.zip
  Length      Date    Time    Name
---------  ---------- -----   ----
        0  03-02-2023 17:52   assets/
        0  03-02-2023 17:52   assets/.gitkeep
      783  03-02-2023 17:52   main.js
      493  03-02-2023 17:52   main.js.map
---------                     -------
     1276                     4 files
```

Assuming that your entrypoint function is called `handler`, then you must
configure Lambda to run `main.handler`.  NOTE that the `main.js` name is
configured by Webpack and does not bear any relation to your Typescript filenames.
