import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs'
import csvParser from 'csv-parser';
import { Readable } from "stream";

export const importFileParser = async (event) => {
  console.log('Lambda function is triggered with S3 event: ', event);
  const s3 = new S3Client({ region: "eu-central-1" });
  const sqs = new SQSClient({ region: "eu-central-1" });

  for (const record of event.Records) {
    const params = {
      Bucket: record.s3.bucket.name,
      Key: record.s3.object.key
    };

    try {
      const response = await s3.send(new GetObjectCommand(params));

      for await (const data of Readable.from(response.Body.pipe(csvParser()))) {
        const sqsParams = {
          QueueUrl: process.env.SQS_QUEUE_URL,
          MessageBody: JSON.stringify(data),
        };
        console.log(`Sending message to SQS: 1`, sqsParams);

        const resp = await sqs.send(new SendMessageCommand(sqsParams));

        console.log(`SQS response: `, resp)
      }

      console.log('CSV processing completed.')
    } catch (error) {
      console.log('Error during processing the file: ', error);
    }
  }
}