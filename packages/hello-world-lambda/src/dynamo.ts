import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { DynamoRecord, EventShape } from './models';
import { createHash } from 'crypto';
import { formatISO } from 'date-fns';

const TableName = process.env['TABLE_NAME'];
const ddbClient = new DynamoDBClient({ region: process.env["region'"] });

export function DynamoRecordFromEvent(
  event: EventShape,
  timestamp: Date | undefined
): DynamoRecord {
  return {
    contentHash: createHash('sha256').update(event.content).digest('hex'),
    timeStamp: timestamp,
    content: event.content,
    source: event.source ?? 'unknown',
    characterCount: event.content.length,
  };
}

export async function DynamoRecordWrite(rec: DynamoRecord) {
  const req = new PutItemCommand({
    TableName,
    Item: {
      ContentHash: { S: rec.contentHash },
      Timestamp: { S: formatISO(rec.timeStamp) as string },
      Content: { S: rec.content },
      Source: { S: rec.source },
      CharacterCount: { N: rec.characterCount.toString() },
    },
  });
  return ddbClient.send(req);
}
