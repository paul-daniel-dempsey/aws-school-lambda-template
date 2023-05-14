import {
  AttributeValue,
  DynamoDBClient,
  PutItemCommand,
  QueryCommand,
} from '@aws-sdk/client-dynamodb';
import { DynamoRecord, EventShape } from './models';
import { createHash } from 'crypto';
import { formatISO, parseISO } from 'date-fns';

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

export async function exampleIndexQuery(
  source: string,
  characterCountLessThen: number
): Promise<DynamoRecord[]> {
  const req = new QueryCommand({
    TableName,
    IndexName: 'idxSourceCharcount',
    KeyConditionExpression: 'Source = :s AND CharacterCount < :cc',
    ExpressionAttributeValues: {
      ':s': { S: source },
      ':cc': { N: characterCountLessThen.toString() },
    },
  });
  const response = await ddbClient.send(req);
  console.log(`Returned a page of ${response.Count} items`);
  const records = response.Items ? response.Items.map(MarshalDynamoRecord) : [];

  records.forEach((rec, ctr) => {
    console.log(`Item ${ctr}: ${JSON.stringify(rec)}  `);
  });
  return records;
}

export function MarshalDynamoRecord(
  record: Record<string, AttributeValue>
): DynamoRecord {
  return {
    characterCount: parseInt(record['CharacterCount'].N),
    content: record['Content'].S,
    contentHash: record['ContentHash'].S,
    source: record['Source'].S,
    timeStamp: parseISO(record['Timestamp'].S),
  };
}
