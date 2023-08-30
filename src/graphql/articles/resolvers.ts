import { Context } from "../../context";
import {
  Article,
  ArticleStatus,
  ArticleType
} from "../../domain/article/entity/article";

export default {
  Mutation: {
    viewArticle: async (_: any, args: { id: string }, { api }: Context) => {
      return api.services.article.viewArticle(args.id);
    }
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
        status: args.status
      });
    }
  }
};
