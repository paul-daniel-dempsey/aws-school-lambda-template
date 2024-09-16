import { SNSEvent, SNSEventRecord, SNSHandler } from 'aws-lambda';
import { EventShape } from './models';
import { parseISO } from 'date-fns';
import { DynamoRecordFromEvent, writeDynamoRecord } from './dynamo';

// export const handler: SNSHandler = async (event: SNSEvent) => {
//   console.log(`Received ${event.Records.length} events`);
//   event.Records.forEach((evt: SNSEventRecord, ctr: number) => {
//     const content = JSON.parse(evt.Sns.Message) as EventShape;

//     console.log(
//       `Message ${ctr}: ${evt.Sns.TopicArn} sent ${content.source} at ${evt.Sns.Timestamp}`
//     );
//     console.log(content.content);
//   });
// };

export const handler: SNSHandler = async (event: SNSEvent) => {
  console.log(`Received ${event.Records.length} events`);

  const results = await Promise.all(
    event.Records.map((evt: SNSEventRecord, ctr: number) => {
      const content = JSON.parse(evt.Sns.Message) as EventShape;
      console.log(
        `Message ${ctr}: ${evt.Sns.TopicArn} from ${content.source} at ${evt.Sns.Timestamp}`
      );
      const eventTS = parseISO(evt.Sns.Timestamp);
      const rec = DynamoRecordFromEvent(content, eventTS);
      return writeDynamoRecord(rec);
    })
  );
  console.log('Finished Dynamo Write.');
};
