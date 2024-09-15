import { SNSEvent, SNSEventRecord, SNSHandler } from 'aws-lambda';

export const handler: SNSHandler = (event: SNSEvent) => {
  console.log(`Received ${event.Records.length} events`);
  event.Records.forEach((evt: SNSEventRecord, ctr: number) => {
    console.log(
      `Message ${ctr}: ${evt.Sns.TopicArn} sent ${evt.Sns.Message} at ${evt.Sns.Timestamp}`
    );
  });
};
