
require('dotenv').config();

import * as express from 'express';
import { logger } from './logger';
import { makeExecutableSchema } from 'graphql-tools';
import { typedefs, resolvers } from './graphql';

const cors = require('cors');

const graphqlHTTP = require('express-graphql');
const isProduction = process.env.NODE_ENV === 'production';
const schema = makeExecutableSchema({ typeDefs: typedefs, resolvers });

const server = express();

server.use(cors());

if (isProduction) {
    // server.use(checkJwt);
    // server.use(checkRole);
}

server.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true
}));

server.listen(process.env.PORT, () => {
    logger.warn('Listening at %s', process.env.PORT);
});

process.on('unhandledRejection', function (error: Error) {
    logger.error('unhandledRejection: ' + error.message, error);
});

process.on('uncaughtException', function (error: Error) {
    logger.error('uncaughtException: ' + error.message, error);
});
