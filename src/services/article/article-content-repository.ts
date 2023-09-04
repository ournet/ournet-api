import { AttributeValue, QueryCommandInput } from "@aws-sdk/client-dynamodb";
import {
  ArticleContent,
  ArticleContentData
} from "../../domain/article/entity/acticle-content";
import { ArticleContentService } from "../../domain/article/service/article-service";
import { DynamoRepository } from "../db/dynamo-repoitory";

export class ArticleContentDynamoService
  extends DynamoRepository<ArticleContentData, ArticleContent>
  implements ArticleContentService
{
  constructor() {
    super(ArticleContent, "article_content_v0");
  }

  getKeyFromId(id: string): Record<string, AttributeValue> {
    return { id: { S: id } };
  }
  formatQueryFindByIdsInput(_ids: string[]): QueryCommandInput {
    throw new Error("Method not implemented.");
  }
}
