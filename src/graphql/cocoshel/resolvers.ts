import { Context } from "../../context";

export default {
  Query: {
    cocoshel_unsubsribe: (_: any, args: { id: string }, context: Context) => {
      return context.data.cocoshel.unsubscribe(args).then(result => !!result);
    }
  }
};
