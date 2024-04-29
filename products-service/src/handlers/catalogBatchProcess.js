import { create } from "../controllers/productController";
import { SNS } from "@aws-sdk/client-sns";

export const catalogBatchProcess = async (event) => {
  const sns = new SNS({ region: "eu-central-1" });

  try {
    for (const record of event.Records) {
      const data = JSON.parse(record.body);
      console.log("Processing record: ", data);

      if (
        data?.price &&
        data?.count &&
        data?.title?.trim() &&
        data?.description?.trim() &&
        data?.image
      ) {
        try {
          console.log(`Creating product start ${data.title}`);
          await create(data);
          console.log(`Created product ${data.title}`);

          const params = {
            Message: `Product ${data.title} created`,
            Subject: "New Product Created",
            TopicArn: process.env.SNS_TOPIC_ARN,
          };

          const messageResp = await sns.publish(params);
          console.log("Message sent successfully", messageResp);
        } catch (e) {
          console.log(`Creating error: ${e.message}`);
        }
      }
    }
  } catch (e) {
    console.log(`Error: ${e.message}`);
  }
};
