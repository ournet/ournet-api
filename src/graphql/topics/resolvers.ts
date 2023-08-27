import { Context } from "../../context";
import { TopicType, TopicWikiId } from "@ournet/topics-domain";

export default {
  Mutation: {
    topics_setTopicType: (
      _: any,
      { id, type }: { id: string; type: TopicType },
      context: Context
    ) => {
      return context.data.topicRep.update({ id, set: { type } });
    }
  },
  Query: {
    topics_topicById: (_: any, args: { id: string }, context: Context) => {
      return context.data.topicRep.getById(args.id);
    },
    topics_topicsByIds: (_: any, args: { ids: string[] }, context: Context) => {
      if (!args.ids.length) return [];
      return context.data.topicRep.getByIds(args.ids);
    },
    topics_topicsByWikiIds: (
      _: any,
      args: { wikiIds: TopicWikiId[] },
      context: Context
    ) => {
      if (!args.wikiIds.length) return [];
      return context.data.topicRep.getByWikiIds(args.wikiIds);
    }
  }
};
