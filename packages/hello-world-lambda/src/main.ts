import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Handler } from 'aws-lambda';

const handler: Handler = async (event, context) => {
  const s3Client = new S3Client({ region: process.env['AW_REGION'] });
  const bucketName = process.env['BUCKET'];
  const filePath = process.env['PATH'];
  if (!bucketName || !filePath) {
    throw new Error('Specify BUCKET and PATH');
  }
  const req = new GetObjectCommand({
    Bucket: bucketName,
    Key: filePath,
  });
  const response = await s3Client.send(req);
  console.log(`Found file with size ${response.ContentLength}...`);
  console.log('File contents is: ');
  const fileContent = await response.Body.transformToString();
  console.log(fileContent);
};

export { handler };
