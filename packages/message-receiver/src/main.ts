import { SNSEvent, SNSEventRecord, SNSHandler } from 'aws-lambda';

interface EventShape {
  source?: string;
  content: string;
}

export const handler: SNSHandler = (event: SNSEvent) => {
  console.log(`Received ${event.Records.length} events`);
  event.Records.forEach((evt: SNSEventRecord, ctr: number) => {
    const content = JSON.parse(evt.Sns.Message) as EventShape;

    console.log(
      `Message ${ctr}: ${evt.Sns.TopicArn} sent ${content.source} at ${evt.Sns.Timestamp}`
    );
    console.log(content.content);
  });
};
