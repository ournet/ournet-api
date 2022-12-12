import { Context } from "../../context";

export default {
  Query: {
    videos_videoById: (_: any, args: { id: string }, context: Context) => {
      return context.data.videoRep.getById(args.id);
    },
    videos_videosByIds: (_: any, args: { ids: string[] }, context: Context) => {
      if (!args.ids?.length) return [];
      return context.data.videoRep.getByIds(args.ids);
    }
  }
};
