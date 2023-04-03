import "source-map-support/register";
import { App } from "aws-cdk-lib";
import { LambdaTemplate } from "../lib/lambda-template";

const app = new App();
new LambdaTemplate(app, "LambdaTemplate-CODE", { stack: "aws-learning", stage: "CODE" });
