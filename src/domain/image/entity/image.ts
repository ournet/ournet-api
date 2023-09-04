import {
  BaseEntity,
  EntityCreateData,
  EntityData,
  EntityUpdateData,
} from "../../base/entity";
import { RequiredJSONSchema } from "../../base/json-schema";

export enum ImageSizeName {
  ORIGINAL = "ORIGINAL",
  LARGE = "LARGE",
  MEDIUM = "MEDIUM",
  SMALL = "SMALL",
  THUMBNAIL = "THUMBNAIL",
}

export interface ImageData extends EntityData {
  contentType: string;
  length: number;
  width: number;
  height: number;
}

export type ImageCreateData = EntityCreateData<ImageData>;
export type ImageUpdateData = EntityUpdateData<ImageData>;

export class Image extends BaseEntity<ImageData> implements ImageData {
  get contentType() {
    return this.get("contentType");
  }

  get length() {
    return this.get("length");
  }

  get width() {
    return this.get("width");
  }

  get height() {
    return this.get("height");
  }

  static createId({ contentType }: Pick<ImageData, "contentType">) {
    const ext = this.extractExtension(contentType);
    return `${super.createId()}${ext.substring(0, 1)}`;
  }

  static extractExtension(contentType: string) {
    const ext = contentType
      .toLowerCase()
      .trim()
      .replace(/^image\//, "");
    if (!["jpeg", "png", "webp"].includes(ext))
      throw new Error(`Invalid image content type: ${contentType}`);

    return ext;
  }

  static getSize(name: ImageSizeName) {
    switch (name) {
      case ImageSizeName.THUMBNAIL:
        return 180;
      case ImageSizeName.SMALL:
        return 320;
      case ImageSizeName.MEDIUM:
        return 640;
      case ImageSizeName.LARGE:
        return 1024;
      default:
        throw new Error(`Invalid image size: ${name}`);
    }
  }

  static jsonSchema: RequiredJSONSchema = {
    type: "object",
    properties: {
      ...BaseEntity.jsonSchema.properties,
      contentType: { type: "string", pattern: "^image/(webp|jpeg|png)$" },
      length: { type: "integer", minimum: 100 },
      width: { type: "integer", minimum: 100, maximum: 3000 },
      height: { type: "integer", minimum: 100, maximum: 3000 },
    },
    required: [
      ...BaseEntity.jsonSchema.required,
      "contentType",
      "length",
      "width",
      "height",
    ],
    additionalProperties: false,
  };
}
