import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import * as process from 'process';
import { DynamoRecord, EventShape } from './models';
import { createHash } from 'crypto';
import { formatISO } from 'date-fns';

const TableName = process.env['TABLE_NAME'];
const ddbClient = new DynamoDBClient({ region: process.env['region'] });

export function DynamoRecordFromEvent(
  event: EventShape,
  timestamp: Date | undefined
): DynamoRecord {
  return {
    characterCount: event.content.length,
    content: event.content,
    contentHash: createHash('sha256').update(event.content).digest('hex'),
    source: event.source ?? 'unknown',
    timeStamp: timestamp ?? new Date(),
  };
}

export async function writeDynamoRecord(rec: DynamoRecord) {
  const req = new PutItemCommand({
    TableName,
    Item: {
      characterCount: { N: rec.characterCount.toString() },
      content: { S: rec.content },
      contentHash: { S: rec.contentHash },
      source: { S: rec.source },
      timeStamp: { S: formatISO(rec.timeStamp) as string },
    },
  });
  return ddbClient.send(req);
}
