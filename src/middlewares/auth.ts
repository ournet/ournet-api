
import { Request, Response, NextFunction } from 'express';

export function auth(req: Request, res: Response, next: NextFunction) {
    let hasData = false;
    if (req.headers.authorization) {
        const parts = Array.isArray(req.headers.authorization)
            ? req.headers.authorization :
            (<string>req.headers.authorization).split(' ');
        if (parts[0] === 'Key') {
            hasData = true;
            if (parts[1] === process.env.OURNET_API_KEY) {
                return next();
            }
        }
    }
    if (hasData) {
        return res.status(401);
    }
    res.status(401).send('missing authorization header');
}
