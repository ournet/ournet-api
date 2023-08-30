import weather from "./weather";
import places from "./places";
import holidays from "./holidays";
import news from "./news";
import topics from "./topics";
import quotes from "./quotes";
import horoscopes from "./horoscopes";
import videos from "./videos";
import cocoshel from "./cocoshel";
import articles from "./articles";

const GraphQLJsonType = require("graphql-type-json");

const rootTypes = `
scalar JSON

type Query {
    ping: String!
}
type Mutation {
    add(n1: Int!, n2:Int!): Int!
}
`;

const rootResolvers = {
  Query: {
    ping: () => "pong"
  },
  Mutation: {
    add: (_: any, { n1, n2 }: { n1: number; n2: number }) => n1 + n2
  }
};

export const typedefs = [
  rootTypes,
  holidays.typedefs,
  weather.typedefs,
  places.typedefs,
  news.typedefs,
  topics.typedefs,
  quotes.typedefs,
  horoscopes.typedefs,
  videos.typedefs,
  cocoshel.typedefs,
  articles.typedefs
].join("\n");

export const resolvers = {
  Query: {
    ...rootResolvers.Query,
    ...holidays.resolvers.Query,
    ...weather.resolvers.Query,
    ...places.resolvers.Query,
    ...news.resolvers.Query,
    ...topics.resolvers.Query,
    ...quotes.resolvers.Query,
    ...horoscopes.resolvers.Query,
    ...videos.resolvers.Query,
    ...cocoshel.resolvers.Query,
    ...articles.resolvers.Query
  },
  Place: places.resolvers.Place,
  HoroscopeReport: horoscopes.resolvers.HoroscopeReport,
  Article: articles.resolvers.Article,
  Mutation: {
    ...rootResolvers.Mutation,
    ...news.resolvers.Mutation,
    ...topics.resolvers.Mutation,
    ...articles.resolvers.Mutation
  },
  JSON: GraphQLJsonType
};
