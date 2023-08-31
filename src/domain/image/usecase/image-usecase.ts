import axios from "axios";
import { BaseUseCase } from "../../base/usecase";
import { ImageService } from "../service/image-service";
import { parse } from "content-type";
import bytes from "bytes";
import { Image } from "../entity/image";
import sharp from "sharp";
import { streamToBuffer } from "../../base/util";

export interface UploadImageInput {
  url: string;
  referer?: string;
}

const getInfo = async (input: Buffer) => {
  const buffer = input;
  const data = await sharp(buffer).metadata();

  return {
    height: data.height || 1,
    width: data.width || 1,
    length: data.size || 1,
  };
};

export class UploadImageUsecase extends BaseUseCase<UploadImageInput, Image> {
  constructor(private imageService: ImageService) {
    super();
  }

  async innerExecute({ url, referer }: UploadImageInput) {
    const response = await axios({
      url,
      method: "GET",
      headers: {
        Accept: "image/*",
        Referer: referer || undefined,
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36",
      },
      responseType: "stream",
      maxRedirects: 0,
      maxContentLength: bytes("12MB"),
    });

    const contentInfo = parse(response.headers["Content-Type"] as never);
    if (!contentInfo || !contentInfo.type)
      throw new Error(
        `Invalid content type: ${response.headers["Content-Type"]}`
      );

    const body = await streamToBuffer(response.data);
    const info = await getInfo(body);

    const contentType = contentInfo.type.trim().toLowerCase();

    const id = Image.createId({ contentType });

    await this.imageService.upload({
      id,
      contentType,
      body,
    });

    return this.imageService.create({
      ...info,
      id,
      contentType,
    });
  }
}
