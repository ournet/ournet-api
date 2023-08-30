import { Request, Response, NextFunction } from "express";
// import JWT from "jsonwebtoken";
import config from "../config";

// const isValidJWTToken = (token: string, secret: string) => {
//   try {
//     const result = JWT.verify(token, secret);
//     return !!result;
//   } catch {
//     return false;
//   }
// };

export const isValidToken = (token?: string) => {
  if (!token) return false;
  if (config.OURNET_API_KEY && token === config.OURNET_API_KEY) return true;

  // const secrets = [config.jwt_secret];

  // for (const secret of secrets) {
  //   if (secret && isValidJWTToken(token, secret)) return true;
  // }

  return false;
};

export const parseAuthToken = (req: Request): string | undefined => {
  const authorization = req.headers.authorization || "";
  const parts = authorization.split(" ");
  return parts.pop();
};

export const isAuthorized = (req: Request) => isValidToken(parseAuthToken(req));

export default (req: Request, res: Response, next: NextFunction) => {
  if (isAuthorized(req)) next();
  else res.status(401).end();
};
