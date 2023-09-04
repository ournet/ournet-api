import {
  BaseEntity,
  EntityCreateData,
  EntityData,
  EntityUpdateData
} from "../../base/entity";
import { RequiredJSONSchema } from "../../base/json-schema";

export enum ArticleContentFormat {
  MD = "MD"
}

export interface ArticleContentData extends EntityData {
  format: ArticleContentFormat;
  content: string;
}

export type ArticleContentCreateData = EntityCreateData<ArticleContentData>;
export type ArticleContentUpdateData = EntityUpdateData<ArticleContentData>;

export class ArticleContent
  extends BaseEntity<ArticleContentData>
  implements ArticleContentData
{
  get format() {
    return this.get("format");
  }

  get content() {
    return this.get("content");
  }

  static createId(_input?: unknown): string {
    throw new Error("Method not implemented.");
  }

  static jsonSchema: RequiredJSONSchema = {
    type: "object",
    properties: {
      ...BaseEntity.jsonSchema.properties,
      format: { type: "string", enum: Object.values(ArticleContentFormat) },
      content: { type: "string" }
    },

    required: [...BaseEntity.jsonSchema.required, "format", "content"],

    additionalProperties: false
  };
}
