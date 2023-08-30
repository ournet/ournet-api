import { CursorPage } from "../../base/pagination";
import { Repository } from "../../base/repository";
import { ArticleContent, ArticleContentData } from "../entity/acticle-content";
import {
  Article,
  ArticleCreateData,
  ArticleData,
  ArticleStatus,
  ArticleUpdateData
} from "../entity/article";

export interface FindArticleCountParams {
  projectKey: string;
  status?: ArticleStatus;
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
}

export interface ArticleContentService
  extends Repository<ArticleContentData, ArticleContent> {}
