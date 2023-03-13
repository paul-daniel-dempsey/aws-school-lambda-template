# AwsSchool Lambda Template

## What is this?

This is the "bare-bones" lambda function setup for the Guardian's informal AWS School series

There is a skeleton lambda function in the `hello-world-lambda` directory which can be found at `packages/hello-world-lambda/src/main.ts`.

## How do I build and use it?

First, make the lambda _do_ something.

```bash
npm i
npm run build
```

Now, take the build zipfile from `dist/packages/hello-world-lambda.zip` and upload it to a Lambda function. Voilà :)

## How do I add more lambda functions?

See [NX cheatsheet.md](./NX%20cheatsheet.md)
