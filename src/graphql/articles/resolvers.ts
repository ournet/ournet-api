import { Context } from "../../context";
import {
  Article,
  ArticleStatus,
  ArticleType,
} from "../../domain/article/entity/article";
import { CreateArticleInput } from "../../domain/article/usecase/create-article-usecase";

export default {
  Mutation: {
    viewArticle: (_: any, args: { id: string }, { api }: Context) => {
      return api.services.article.viewArticle(args.id);
    },
    createArticle: (_: any, args: CreateArticleInput, { api }: Context) => {
      return api.usecases.createArticle.execute(args, api);
    },
    deleteArticle: (_: any, args: { id: string }, { api }: Context) => {
      return api.usecases.deleteArticle.execute(args, api);
    },
  },
  Query: {
    articleById: (_: any, args: { id: string }, { api }: Context) => {
      return api.services.article.findById(args.id);
    },
    articleByIds: (_: any, args: { ids: string[] }, { api }: Context) => {
      if (!args.ids.length) return [];
      return api.services.article.findByIds(args.ids);
    },
    findArticle: (
      _: any,
      args: {
        lang: string;
        country: string;
        type?: ArticleType;
        status?: ArticleStatus;
        limit: number;
        offset?: number;
      },
      { api }: Context
    ) => {
      const projectKey = Article.createProjectKey(args);
      return api.services.article.find({
        first: args.limit,
        projectKey,
        offset: args.offset,
        status: args.status,
      });
    },
  },
  Article: {
    content: (root: Article, _: any, { api }: Context) => {
      return api.services.articleContent.findById(root.id);
    },
  },
};
