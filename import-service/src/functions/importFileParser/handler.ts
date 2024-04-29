import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import csvParser from 'csv-parser';

export const importFileParser = async (event) => {
  console.log('Lambda function is triggered with S3 event: ', event);
  const s3 = new S3Client({ region: "eu-central-1" });

  for (const record of event.Records) {
    const params = {
      Bucket: record.s3.bucket.name,
      Key: record.s3.object.key
    };

    try {
      const response = await s3.send(new GetObjectCommand(params));

      response.Body.pipe(csvParser())
        .on('data', (data) => console.log(data))
        .on('end', () => console.log('CSV processing completed.'));

    } catch (error) {
      console.log('Error during processing the file: ', error);
    }
  }

}