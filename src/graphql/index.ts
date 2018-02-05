
import weather from './weather';

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

export const typedefs = [rootTypes, weather.typedefs].join('\n');

export const resolvers = {
    Query: { ...rootResolvers.Query, ...weather.resolvers.Query },
    // Mutation: { ...{}, ...weather.resolvers.Mutation },
};
