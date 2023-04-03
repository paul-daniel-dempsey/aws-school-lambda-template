import type {GuStackProps} from "@guardian/cdk/lib/constructs/core";
import {GuStack} from "@guardian/cdk/lib/constructs/core";
import type {App} from "aws-cdk-lib";
import {Arn, Duration} from "aws-cdk-lib";
import {GuScheduledLambda} from "@guardian/cdk";
import {Runtime} from "aws-cdk-lib/aws-lambda";
import {Schedule} from "aws-cdk-lib/aws-events";
import {Effect, PolicyStatement} from "aws-cdk-lib/aws-iam";

const myBucket = "MyBucktName";

export class LambdaTemplate extends GuStack {
  constructor(scope: App, id: string, props: GuStackProps) {
    super(scope, id, props);

    new GuScheduledLambda(this, "TestScheduledLambda", {
      app: "hello-world",
      fileName: "hello-world-lambda.zip",
      handler: "main.handler",
      monitoringConfiguration: {
        noMonitoring: true
      },
      initialPolicy: [
        new PolicyStatement({
          effect: Effect.ALLOW,
          actions: ["s3:GetObject"],
          resources: [`arn:aws:s3:::${myBucket}`],
        })
      ],
      memorySize: 128,
      timeout: Duration.seconds(5),
      rules: [
        {
          schedule: Schedule.rate(Duration.minutes(1))
        }
      ],
      runtime: Runtime.NODEJS_18_X,

    })
  }
}
