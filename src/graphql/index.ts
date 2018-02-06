
import weather from './weather';
import places from './places';
import { Data } from '../data';
const GraphQLJsonType = require('graphql-type-json');

const rootTypes = `
scalar JSON

type Query {
    holidays(country: String!, lang: String!, start: Int, end: Int): JSON
}
# type Mutation {}
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
    }
}

export const typedefs = [rootTypes, weather.typedefs, places.typedefs].join('\n');

export const resolvers = {
    Query: { ...rootResolvers.Query, ...weather.resolvers.Query, ...places.resolvers.Query },
    Place: places.resolvers.Place,
    JSON: GraphQLJsonType,
    // Mutation: { ...{}, ...weather.resolvers.Mutation },
};
