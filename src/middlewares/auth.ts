
import { Request, Response, NextFunction } from 'express';
import { logger } from '../logger';

export function auth(req: Request, res: Response, next: NextFunction) {
    let hasData = false;
    if (req.headers.authorization) {
        const parts = Array.isArray(req.headers.authorization)
            ? req.headers.authorization :
            (<string>req.headers.authorization).split(' ');
        if (parts.length === 2) {
            hasData = true;
            if (parts[1] === process.env.OURNET_API_KEY) {
                return next();
            }
        }
    }
    logger.warn(`invalid header authorization: ${JSON.stringify(req.headers)}`);
    if (hasData) {
        return res.status(401);
    }
    res.status(401).send('missing authorization header');
}
