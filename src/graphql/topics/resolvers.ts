import { RepositoryUpdateData } from "@ournet/domain";
import { Context } from "../../context";
import { Topic, TopicType, TopicWikiId } from "@ournet/topics-domain";

export default {
  Mutation: {
    topics_setTopicType: (
      _: any,
      { id, type }: { id: string; type: TopicType },
      context: Context
    ) => {
      const data: RepositoryUpdateData<Topic> = { id };
      if (type) data.set = { type };
      else data.delete = ["type"];
      return context.data.topicRep.update(data);
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
