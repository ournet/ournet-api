require("dotenv").config();

import { logger } from "./logger";
import { typedefs, resolvers } from "./graphql";
import { Context } from "./context";
import { isAuthenticated } from "./middlewares/auth";
import {
  gql,
  ApolloServer,
  AuthenticationError,
  IResolvers
} from "apollo-server";
const typeDefs = gql`
  ${typedefs}
`;
const isProduction = process.env.NODE_ENV === "production";
const PORT = process.env.PORT;

declare global {
  namespace Express {
    interface Request {
      context: Context;
    }
  }
}

async function start() {
  const context = await Context.create();
  const server = new ApolloServer({
    typeDefs,
    resolvers: resolvers as IResolvers<any, Context>,
    cors: true,
    context: async ({ req }: any) => {
      if (isProduction && !isAuthenticated(req)) {
        logger.warn(
          `invalid header authorization: ${JSON.stringify(req.headers)}`
        );
        throw new AuthenticationError("No key");
      }

      return context;
    },
    playground: true,
    introspection: true
  });

  await server.listen(PORT);
}

process.on("uncaughtException", function (error: Error) {
  logger.error("uncaughtException: " + error.message, error);
});

start()
  .then(() => logger.warn(`Listening at ${PORT}`))
  .catch((e) => {
    logger.error(e);
  });
