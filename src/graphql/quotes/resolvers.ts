import { Context } from "../../context";
import {
  ListQuotesQueryParams,
  CountQuotesByAuthorQueryParams,
  CountQuotesByTopicQueryParams,
  CountQuotesQueryParams,
  ListQuotesByAuthorQueryParams,
  ListQuotesByTopicQueryParams
} from "@ournet/quotes-domain";

export default {
  Query: {
    quotes_quoteById: (_: any, args: { id: string }, context: Context) => {
      return context.data.quoteRep.getById(args.id);
    },
    quotes_quotesByIds: (_: any, args: { ids: string[] }, context: Context) => {
      if (!args.ids.length) return [];
      return context.data.quoteRep.getByIds(args.ids);
    },
    quotes_latest: (
      _: any,
      args: { params: ListQuotesQueryParams },
      context: Context
    ) => {
      return context.data.quoteRep.latest(args.params);
    },
    quotes_latestByTopic: (
      _: any,
      args: { params: ListQuotesByTopicQueryParams },
      context: Context
    ) => {
      return context.data.quoteRep.latestByTopic(args.params);
    },
    quotes_latestByAuthor: (
      _: any,
      args: { params: ListQuotesByAuthorQueryParams },
      context: Context
    ) => {
      return context.data.quoteRep.latestByAuthor(args.params);
    },
    quotes_count: (
      _: any,
      args: { params: CountQuotesQueryParams },
      context: Context
    ) => {
      return context.data.quoteRep.count(args.params);
    },
    quotes_countByTopic: (
      _: any,
      args: { params: CountQuotesByTopicQueryParams },
      context: Context
    ) => {
      return context.data.quoteRep.countByTopic(args.params);
    },
    quotes_countByAuthor: (
      _: any,
      args: { params: CountQuotesByAuthorQueryParams },
      context: Context
    ) => {
      return context.data.quoteRep.countByAuthor(args.params);
    },
    quotes_topTopics: (
      _: any,
      args: { params: ListQuotesQueryParams },
      context: Context
    ) => {
      return context.data.quoteRep.topTopics(args.params);
    },
    quotes_topAuthors: (
      _: any,
      args: { params: ListQuotesQueryParams },
      context: Context
    ) => {
      return context.data.quoteRep.topAuthors(args.params);
    },
    quotes_topAuthorTopics: (
      _: any,
      args: { params: ListQuotesByAuthorQueryParams },
      context: Context
    ) => {
      return context.data.quoteRep.topAuthorTopics(args.params);
    },
    quotes_popularByAuthor: (
      _: any,
      args: { params: ListQuotesByAuthorQueryParams },
      context: Context
    ) => {
      return context.data.quoteRep.popularQuotesByAuthor(args.params);
    }
  }
};
