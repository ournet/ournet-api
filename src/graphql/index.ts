
import weather from './weather';
import places from './places';
import { Data } from '../data';
const GraphQLJsonType = require('graphql-type-json');

const rootTypes = `
scalar JSON

type Query {
    holidays(country: String!, lang: String!, start: Int, end: Int): JSON
}
type Mutation {
    add(n1: Int!, n2:Int!): Int
}
`

const rootResolvers = {
    Query: {
        holidays: (_: any, args: { country: string, lang: string, start?: number, end?: number }) => {
            if (args.start) {
                args.start = args.start * 1000;
            }
            if (args.end) {
                args.end = args.end * 1000;
            }

            return Data.holidays(args)
        }
    },
    Mutation: {
        add: (_: any, { n1, n2 }: { n1: number, n2: number }) => n1 + n2
    }
}

export const typedefs = [rootTypes, weather.typedefs, places.typedefs].join('\n');

export const resolvers = {
    Query: { ...rootResolvers.Query, ...weather.resolvers.Query, ...places.resolvers.Query },
    Place: places.resolvers.Place,
    JSON: GraphQLJsonType,
    Mutation: { ...rootResolvers.Mutation },
};
