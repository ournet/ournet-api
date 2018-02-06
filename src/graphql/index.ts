
import weather from './weather';
import places from './places';

const rootTypes = `
type Query {
    ping: String
}
# type Mutation {}
`

const rootResolvers = {
    Query: {
        ping: (_: any, _args: any) => 'pong'
    }
}

export const typedefs = [rootTypes, weather.typedefs, places.typedefs].join('\n');

export const resolvers = {
    Query: { ...rootResolvers.Query, ...weather.resolvers.Query, ...places.resolvers.Query },
    Place: places.resolvers.Place,
    // Mutation: { ...{}, ...weather.resolvers.Mutation },
};
