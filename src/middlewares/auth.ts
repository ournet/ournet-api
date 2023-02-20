import { Request, Response, NextFunction } from "express";
import { logger } from "../logger";

const getToken = (req: Request): string | string[] | null =>
  (req.query["api_token"]?.length
    ? (req.query["api_token"] as never)
    : (null as never)) ||
  req.headers.authorization ||
  null;

export function auth(req: Request, res: Response, next: NextFunction) {
  let hasData = false;
  const token = getToken(req);
  if (token) {
    const parts = Array.isArray(token) ? token : (<string>token).split(" ");
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
  res.status(401).send("missing authorization header");
}

export function isAuthenticated(req: Request) {
  const token = getToken(req);
  if (token) {
    const parts = Array.isArray(token) ? token : (<string>token).split(" ");
    if (parts.length === 2) {
      if (parts[1] === process.env.OURNET_API_KEY) {
        return true;
      }
    }
  }
  return false;
}
