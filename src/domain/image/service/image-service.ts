import { Repository } from "../../base/repository";
import {
  ImageCreateData,
  ImageUpdateData,
  Image,
  ImageData,
} from "../entity/image";
import { ReadStream } from "fs";

export interface UploadImageParams {
  id: string;
  body: Buffer | ReadStream;
  contentType: string;
}

export interface ImageService
  extends Repository<ImageData, Image, ImageCreateData, ImageUpdateData> {
  upload(params: UploadImageParams): Promise<string>;
}
