import { SNSEvent, SNSEventRecord, SNSHandler } from 'aws-lambda';
import { EventShape } from './models';

const handler: SNSHandler = (event: SNSEvent) => {
  console.log(`Received ${event.Records.length} events`);
  event.Records.forEach((evt: SNSEventRecord, ctr: number) => {
    const content = JSON.parse(evt.Sns.Message) as EventShape;
    console.log(
      `MessageSNS ${ctr}: ${evt.Sns.TopicArn} sent ${content.source} at ${evt.Sns.Timestamp}`
    );
    console.log(`ContentSNS ${ctr}: ${content.content}`);
  });
};

export { handler };
