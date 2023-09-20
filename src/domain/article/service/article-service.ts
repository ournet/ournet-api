import { CursorPage } from "../../base/pagination";
import { Repository } from "../../base/repository";
import { ArticleContent, ArticleContentData } from "../entity/acticle-content";
import {
  Article,
  ArticleCreateData,
  ArticleData,
  ArticleStatus,
  ArticleType,
  ArticleUpdateData
} from "../entity/article";

export interface FindArticleCountParams {
  projectKey: string;
  status?: ArticleStatus;
  type?: ArticleType;
}

export interface FindArticleParams extends FindArticleCountParams {
  first: number;
  after?: string;
  offset?: number;
}

export interface ArticleService
  extends Repository<
    ArticleData,
    Article,
    ArticleCreateData,
    ArticleUpdateData
  > {
  find(params: FindArticleParams): Promise<Article[]>;
  findCount(params: FindArticleCountParams): Promise<number>;
  findCursor(params: FindArticleParams): Promise<CursorPage<Article>>;
  viewArticle(id: string): Promise<number>;
}

export interface ArticleContentService
  extends Repository<ArticleContentData, ArticleContent> {}
