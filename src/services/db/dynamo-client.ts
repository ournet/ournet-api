import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import config from "../../config";

export default new DynamoDBClient({
  region: config.AWS_REGION,
  credentials: {
    accessKeyId: config.AWS_ACCESS_KEY_ID,
    secretAccessKey: config.AWS_SECRET_ACCESS_KEY
  }
});
