import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const importProductsFile = async ({ queryStringParameters }) => {
  const client = new S3Client({ region: "eu-central-1" });
  const fileName = queryStringParameters.name;
  const path = `uploaded/${fileName}`;
  const command = new GetObjectCommand({
    Bucket: "yudin-aws-import-service",
    Key: path,
  });

  try {
    const signedUrl = await getSignedUrl(client, command, {
      expiresIn: 60 * 60,
    });

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify(signedUrl),
    };
  } catch (error) {
    console.error("Error getting signed URL", error);

    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify("Error getting signed URL"),
    };
  }
};
