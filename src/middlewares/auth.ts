import { Request, Response, NextFunction } from "express";
import { logger } from "../logger";

const getToken = (req: Request): string | null => {
  let token = req.headers.authorization || null;
  if (token) return token.split(" ").pop() || null;

  return (req.query.api_token as string) || null;
};

export function auth(req: Request, res: Response, next: NextFunction) {
  let hasData = false;
  const token = getToken(req);
  if (token) {
    hasData = true;
    if (token === process.env.OURNET_API_KEY) {
      return next();
    }
  }
  logger.warn(`invalid header authorization: ${JSON.stringify(req.headers)}`);
  if (hasData) {
    return res.status(401);
  }
  res.status(401).send("missing authorization header");
}

export function isAuthenticated(req: Request) {
  const token = getToken(req);
  if (token) {
    if (token === process.env.OURNET_API_KEY) {
      return true;
    }
  }

  return false;
}
