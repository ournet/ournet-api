import { AttributeValue, QueryCommandInput } from "@aws-sdk/client-dynamodb";
import { PutObjectCommand, PutObjectCommandInput } from "@aws-sdk/client-s3";
import config from "../../config";
import { ImageData, Image } from "../../domain/image/entity/image";
import {
  ImageService,
  UploadImageParams,
} from "../../domain/image/service/image-service";
import { DynamoRepository } from "../db/dynamo-repoitory";
import { s3Client } from "../s3/s3-client";

export class ImageDynamoService
  extends DynamoRepository<ImageData, Image>
  implements ImageService {
  constructor() {
    super(Image, "image_v0");
  }

  async upload({ contentType, id, body }: UploadImageParams): Promise<string> {
    const ext = Image.extractExtension(contentType);
    const Key = `images/${id.substr(0, 4)}/${id}.${ext}`;
    const input: PutObjectCommandInput = {
      Bucket: config.AWS_IMAGES_BUCKET,
      ACL: "public-read",
      Key,
      Body: body,
      CacheControl: "public, max-age=" + 86400 * 30,
      ContentType: contentType,
    };

    const command = new PutObjectCommand(input);

    const response = await s3Client.send(command);

    console.log(response);

    return `https://${input.Bucket}.s3${s3Client.config.region}.amazonaws.com/${Key}`;
  }

  getKeyFromId(id: string): Record<string, AttributeValue> {
    return { id: { S: id } };
  }
  formatQueryFindByIdsInput(_ids: string[]): QueryCommandInput {
    throw new Error("Method not implemented.");
  }
}
