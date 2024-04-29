
import { handlerPath } from 'src/utils/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.importFileParser`,
  events: [
    {
      s3: {
        bucket: 'yudin-aws-import-service',
        event: 's3:ObjectCreated:*',
        rules: [
          {
            prefix: 'uploaded/',
          },
          {
            suffix: '.csv',
          }
        ],
        existing: true,
      },
    },
  ],
};
