import { Context } from "../../context";
import {
  NewsSearchParams,
  LatestNewsQueryParams,
  LatestNewsBySourceQueryParams,
  LatestNewsByTopicQueryParams,
  LatestNewsByEventQueryParams,
  CountNewsQueryParams,
  CountNewsBySourceQueryParams,
  CountNewsByTopicQueryParams,
  CountNewsByEventQueryParams,
  LatestEventsQueryParams,
  CountEventsQueryParams,
  LatestEventsByTopicQueryParams,
  CountEventsByTopicQueryParams,
  TrendingTopicsQueryParams,
  SimilarEventsByTopicsQueryParams
} from "@ournet/news-domain";

export default {
  Mutation: {
    news_viewNewsEvent: (_: any, args: { id: string }, context: Context) => {
      return context.data.eventRep.viewNewsEvent(args.id);
    },
    news_viewNewsItem: (_: any, args: { id: string }, context: Context) => {
      return context.data.newsRep.viewNewsItem(args.id);
    }
  },
  Query: {
    news_itemById: (_: any, args: { id: string }, context: Context) => {
      return context.data.newsRep.getById(args.id);
    },
    news_itemsByIds: (_: any, args: { ids: string[] }, context: Context) => {
      if (!args.ids.length) return [];
      return context.data.newsRep.getByIds(args.ids);
    },
    news_itemsSearch: (
      _: any,
      args: { params: NewsSearchParams },
      context: Context
    ) => {
      return context.data.newsRep.search(args.params);
    },
    news_itemsLatest: (
      _: any,
      args: { params: LatestNewsQueryParams },
      context: Context
    ) => {
      return context.data.newsRep.latest(args.params);
    },
    news_itemsLatestBySource: (
      _: any,
      args: { params: LatestNewsBySourceQueryParams },
      context: Context
    ) => {
      return context.data.newsRep.latestBySource(args.params);
    },
    news_itemsLatestByTopic: (
      _: any,
      args: { params: LatestNewsByTopicQueryParams },
      context: Context
    ) => {
      return context.data.newsRep.latestByTopic(args.params);
    },
    news_itemsLatestByEvent: (
      _: any,
      args: { params: LatestNewsByEventQueryParams },
      context: Context
    ) => {
      return context.data.newsRep.latestByEvent(args.params);
    },
    news_itemsCount: (
      _: any,
      args: { params: CountNewsQueryParams },
      context: Context
    ) => {
      return context.data.newsRep.count(args.params);
    },
    news_itemsCountBySource: (
      _: any,
      args: { params: CountNewsBySourceQueryParams },
      context: Context
    ) => {
      return context.data.newsRep.countBySource(args.params);
    },
    news_itemsCountByTopic: (
      _: any,
      args: { params: CountNewsByTopicQueryParams },
      context: Context
    ) => {
      return context.data.newsRep.countByTopic(args.params);
    },
    news_itemsCountByEvent: (
      _: any,
      args: { params: CountNewsByEventQueryParams },
      context: Context
    ) => {
      return context.data.newsRep.countByEvent(args.params);
    },
    news_topSources: (
      _: any,
      args: { params: LatestNewsQueryParams },
      context: Context
    ) => {
      return context.data.newsRep.topSources(args.params);
    },
    news_topSourceTopics: (
      _: any,
      args: { params: LatestNewsBySourceQueryParams },
      context: Context
    ) => {
      return context.data.newsRep.topSourceTopics(args.params);
    },

    news_eventById: (_: any, args: { id: string }, context: Context) => {
      return context.data.eventRep.getById(args.id);
    },
    news_eventsByIds: (_: any, args: { ids: string[] }, context: Context) => {
      if (!args.ids.length) return [];
      return context.data.eventRep.getByIds(args.ids);
    },
    news_eventsLatest: (
      _: any,
      args: { params: LatestEventsQueryParams },
      context: Context
    ) => {
      return context.data.eventRep.latest(args.params);
    },
    news_eventsLatestByTopic: (
      _: any,
      args: { params: LatestEventsByTopicQueryParams },
      context: Context
    ) => {
      return context.data.eventRep.latestByTopic(args.params);
    },
    news_eventsCount: (
      _: any,
      args: { params: CountEventsQueryParams },
      context: Context
    ) => {
      return context.data.eventRep.count(args.params);
    },
    news_eventsCountByTopic: (
      _: any,
      args: { params: CountEventsByTopicQueryParams },
      context: Context
    ) => {
      return context.data.eventRep.countByTopic(args.params);
    },
    news_topTopics: (
      _: any,
      args: { params: LatestEventsQueryParams },
      context: Context
    ) => {
      return context.data.eventRep.topTopics(args.params);
    },
    news_trendingTopics: (
      _: any,
      args: { params: TrendingTopicsQueryParams },
      context: Context
    ) => {
      return context.data.eventRep.topTopics(args.params);
    },

    news_articleContentById: (
      _: any,
      args: { id: string },
      context: Context
    ) => {
      return context.data.articleContentRep.getById(args.id);
    },
    news_articleContentsByIds: (
      _: any,
      args: { ids: string[] },
      context: Context
    ) => {
      if (!args.ids.length) return [];
      return context.data.articleContentRep.getByIds(args.ids);
    },

    news_similarEventsByTopics: (
      _: any,
      args: { params: SimilarEventsByTopicsQueryParams },
      context: Context
    ) => {
      return context.data.eventRep.similarByTopics(args.params);
    }
  }
};
