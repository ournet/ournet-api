import { Context } from "../../context";

export default {
  Mutation: {
    createImage: (
      _: any,
      args: {
        url: string;
        referer?: string;
      },
      { api }: Context
    ) => {
      return api.usecases.uploadImage.execute(args, api);
    },
  },
  Query: {
    imageById: (_: any, args: { id: string }, { api }: Context) => {
      return api.services.image.findById(args.id);
    },
  },
};
