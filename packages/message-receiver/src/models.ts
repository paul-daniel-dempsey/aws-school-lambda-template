export interface EventShape {
  source?: string;
  content: string;
}

export interface DynamoRecord {
  contentHash: string;
  timeStamp: Date;
  source: string;
  content: string;
  characterCount: number;
}
