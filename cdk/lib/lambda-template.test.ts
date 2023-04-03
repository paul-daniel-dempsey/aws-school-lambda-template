import { App } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { LambdaTemplate } from "./lambda-template";

describe("The LambdaTemplate stack", () => {
  it("matches the snapshot", () => {
    const app = new App();
    const stack = new LambdaTemplate(app, "LambdaTemplate", { stack: "aws-learning", stage: "TEST" });
    const template = Template.fromStack(stack);
    expect(template.toJSON()).toMatchSnapshot();
  });
});
