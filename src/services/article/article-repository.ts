import {
  AttributeValue,
  QueryCommand,
  QueryCommandInput,
  UpdateItemCommand,
  UpdateItemCommandInput
} from "@aws-sdk/client-dynamodb";
import {
  Article,
  ArticleCreateData,
  ArticleData,
  ArticleUpdateData
} from "../../domain/article/entity/article";
import { DynamoRepository } from "../db/dynamo-repoitory";
import {
  ArticleService,
  FindArticleCountParams,
  FindArticleParams
} from "../../domain/article/service/article-service";
import { CursorPage, createCursorPage } from "../../domain/base/pagination";
import dynamoClient from "../db/dynamo-client";

export class ArticleDynamoService
  extends DynamoRepository<
    ArticleData,
    Article,
    ArticleCreateData,
    ArticleUpdateData
  >
  implements ArticleService
{
  constructor() {
    super(Article, "article_v0");
  }

  async viewArticle(id: string): Promise<number> {
    const input: UpdateItemCommandInput = {
      TableName: this.tableName,
      Key: this.getKeyFromId(id),
      UpdateExpression: "SET #countViews = #countViews + :inc",
      ExpressionAttributeNames: {
        "#countViews": "countViews"
      },
      ExpressionAttributeValues: {
        ":inc": { N: "1" }
      },
      ReturnValues: "UPDATED_NEW"
    };

    const command = new UpdateItemCommand(input);
    const response = await dynamoClient.send(command);
    return response.Attributes
      ? this.attributesToEntity(response.Attributes).countViews
      : 0;
  }

  async find(params: FindArticleParams): Promise<Article[]> {
    const input: QueryCommandInput = {
      TableName: this.tableName,
      KeyConditionExpression: "#projectKey = :projectKey",
      ExpressionAttributeNames: {
        "#projectKey": "projectKey"
      },
      ExpressionAttributeValues: {
        ":projectKey": { S: params.projectKey }
      },
      Limit: params.first,
      ExclusiveStartKey: params.after
        ? this.getKeyFromId(params.after)
        : undefined
    };

    const command = new QueryCommand(input);

    const response = await dynamoClient.send(command);
    return (response.Items || []).map((item) => {
      return this.attributesToEntity(item);
    });
  }

  async findCount(params: FindArticleCountParams): Promise<number> {
    const input: QueryCommandInput = {
      TableName: this.tableName,
      KeyConditionExpression: "#projectKey = :projectKey",
      ExpressionAttributeNames: {
        "#projectKey": "projectKey"
      },
      ExpressionAttributeValues: {
        ":projectKey": { S: params.projectKey }
      },
      Select: "COUNT"
    };

    const command = new QueryCommand(input);
    const response = await dynamoClient.send(command);
    return response.Count || 0;
  }

  findCursor(params: FindArticleParams): Promise<CursorPage<Article>> {
    const { after, first, offset, ...countParams } = params;
    return createCursorPage(
      { after, first },
      () => this.findCount(countParams),
      () => this.find(params)
    );
  }

  getKeyFromId(id: string): Record<string, AttributeValue> {
    const projectKey = Article.extractProjectKey(id);
    return {
      projectKey: { S: projectKey },
      id: { S: id }
    };
  }

  formatQueryFindByIdsInput(_ids: string[]): QueryCommandInput {
    throw new Error("Method not implemented.");
  }
}
