import {
  BaseEntity,
  EntityCreateData,
  EntityData,
  EntityUpdateData
} from "../../base/entity";
import { RequiredJSONSchema } from "../../base/json-schema";
import { slugify } from "../../base/util";

export enum ArticleType {
  SPONSORED = "SPONSORED"
}

export enum ArticleStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE"
}

export interface ArticleData extends EntityData {
  lang: string;
  country: string;
  projectKey: string;
  type: ArticleType;
  title: string;
  slug: string;
  status: ArticleStatus;
  client: string;
  countViews: number;
  description?: string;
  imageId?: string;
  expiresAt?: string;
}

export type ArticleUpdateData = EntityUpdateData<ArticleData>;
export type ArticleCreateData = EntityCreateData<ArticleData>;

export class Article extends BaseEntity<ArticleData> implements ArticleData {
  get lang() {
    return this.get("lang");
  }

  get country() {
    return this.get("country");
  }

  get projectKey() {
    return this.get("projectKey");
  }

  get type() {
    return this.get("type");
  }

  get title() {
    return this.get("title");
  }

  get slug() {
    return this.get("slug");
  }

  get status() {
    return this.get("status");
  }

  get description() {
    return this.get("description");
  }

  get imageId() {
    return this.get("imageId");
  }

  get client() {
    return this.get("client");
  }

  get countViews() {
    return this.get("countViews");
  }

  get expiresAt() {
    return this.get("expiresAt");
  }

  static createId(input: Pick<ArticleData, "country" | "lang">) {
    return `${this.createProjectKey(input)}${BaseEntity.createId().substring(
      0,
      8
    )}`;
  }

  static createSlug(title: string) {
    return slugify(title.trim().substring(0, 100).trim());
  }

  static createProjectKey({
    country,
    lang
  }: Pick<ArticleData, "country" | "lang">) {
    return `${country.trim().toLowerCase()}${lang.trim().toLowerCase()}`;
  }

  static extractProjectKey(id: string) {
    return id.slice(0, 4);
  }

  static override jsonSchema: RequiredJSONSchema = {
    type: "object",

    properties: {
      ...BaseEntity.jsonSchema.properties,
      lang: { type: "string", pattern: "^[a-z]{2}$" },
      country: { type: "string", pattern: "^[a-z]{2}$" },
      projectKey: { type: "string", pattern: "^[a-z]{2}[a-z]{2}$" },
      type: { type: "string", enum: Object.values(ArticleType) },
      title: { type: "string", minLength: 1, maxLength: 255 },
      slug: { type: "string", pattern: "^[a-z0-9-]{1,100}$" },
      status: { type: "string", enum: Object.values(ArticleStatus) },
      description: { type: ["null", "string"], minLength: 1, maxLength: 255 },
      imageId: { type: ["null", "string"], minLength: 1, maxLength: 40 },
      client: { type: "string", minLength: 1, maxLength: 50 },
      countViews: { type: "integer", minimum: 0 },
      expiresAt: { type: ["null", "string"], format: "date-time" }
    },

    required: [
      ...BaseEntity.jsonSchema.required,
      "type",
      "title",
      "slug",
      "status",
      "lang",
      "country",
      "projectKey",
      "client",
      "countViews"
    ],

    additionalProperties: false
  };
}
