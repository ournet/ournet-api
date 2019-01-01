
require('dotenv').config();

import * as express from 'express';
import { logger } from './logger';
const graphqlTools = require('graphql-tools');
import { typedefs, resolvers } from './graphql';
import { Context } from './context';
import { auth } from './middlewares/auth';
const cors = require('cors');
const graphqlHTTP = require('express-graphql');
const isProduction = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT;

declare global {
    namespace Express {
        interface Request {
            context: Context
        }
    }
}

const schema = graphqlTools.makeExecutableSchema({ typeDefs: typedefs, resolvers });

async function start() {
    const context = await Context.create();
    const server = express();

    server.use((req: express.Request, _res: express.Response, next: express.NextFunction) => {
        req.context = context;
        next();
    });

    server.use(cors());

    if (isProduction) {
        server.use(auth);
    }

    server.use('/graphql', graphqlHTTP({
        schema: schema,
        graphiql: true,
        context: context,
    }));

    await server.listen(PORT);
}

process.on('unhandledRejection', function (error: Error) {
    logger.error('unhandledRejection: ' + error.message, error);
});

process.on('uncaughtException', function (error: Error) {
    logger.error('uncaughtException: ' + error.message, error);
});

start()
    .then(() => logger.warn(`Listening at ${PORT}`))
    .catch(e => {
        logger.error(e);
    });
