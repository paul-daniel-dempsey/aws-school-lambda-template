import { SNSEvent, SNSEventRecord, SNSHandler } from 'aws-lambda';
import { parseISO } from 'date-fns';
import { DynamoRecordFromEvent, DynamoRecordWrite } from './dynamo';
import { EventShape } from './models';

const exclusions = process.env['EXCLUDED_SOURCES']
  ? process.env['EXCLUDED_SOURCES'].split(/\s*,\s*/)
  : [];

// Lesson 6+7 DynamoDB
const handler: SNSHandler = async (event: SNSEvent) => {
  console.log(`Received ${event.Records.length} events`);
  const results = await Promise.all(
    event.Records.map((evt: SNSEventRecord, ctr: number) => {
      const content = JSON.parse(evt.Sns.Message) as EventShape;
      console.log(
        `MessageDynamoDB ${ctr}: ${evt.Sns.TopicArn} sent ${content.source} at ${evt.Sns.Timestamp}`
      );
      const eventTS = parseISO(evt.Sns.Timestamp);
      const rec = DynamoRecordFromEvent(content, eventTS);
      if (!exclusions.includes(rec.source)) {
        return DynamoRecordWrite(rec);
      } else {
        return Promise.resolve();
      }
    })
  );
  console.log('Finished Dynamo exclusions write.');
};

export { handler };
