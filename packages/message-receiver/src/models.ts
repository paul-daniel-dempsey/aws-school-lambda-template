interface EventShape {
  source?: string;
  content: string;
}
interface DynamoRecord {
  contentHash: string;
  timeStamp: Date;
  source: string;
  content: string;
  characterCount: number;
}
export type { EventShape, DynamoRecord };
