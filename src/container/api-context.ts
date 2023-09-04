/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { ApiServices, getApiServices } from "./services";
import { ApiContextInput, ApiUserData } from "./types";
// import { getRedisInstance } from "../services/db/redis";
// import { dbInstance } from "../services/db/db";
// import RedisCacheStorage from "../services/db/redis-cache-storage";
import { CacheStorage } from "../domain/base/cache-storage";
import getHeadersData from "./helpers/get-headers-data";
import { ApiUsecases, getApiUsecases } from "./usecases";
import { DomainContext } from "../domain/base/usecase";
// import { AuthenticationError } from "apollo-server-express";
// import { isAuthorized } from "./authorization";

export interface ApiContext extends DomainContext {
  // db: Knex;
  services: ApiServices;
  usecases: ApiUsecases;
  end: () => Promise<void>;
  ended: boolean;
}

const getDataFromInput = (input: ApiContextInput): ApiUserData => {
  const { language, isAuthenticated, ip } = input;

  return {
    language,
    isAuthenticated,
    ip
  };
};

export async function createApiContext(input: {
  req: Request;
  res: Response;
}): Promise<ApiContext>;
export async function createApiContext(
  input: ApiContextInput
): Promise<ApiContext>;
export async function createApiContext(): Promise<ApiContext>;

export async function createApiContext(
  input?: { req: Request; res: Response } | ApiContextInput
): Promise<ApiContext> {
  // const redis = getRedisInstance();
  const cacheStorage: CacheStorage = null as never; // new RedisCacheStorage(redis);

  const req = ((input as any)?.req as Request) || undefined;
  // const res = ((input as any)?.res as Response) || undefined;
  const inputData = input && !req ? (input as ApiContextInput) : undefined;

  const services = getApiServices(cacheStorage);

  // const db: Knex = inputData?.services?.db || dbInstance();

  const data = req
    ? getHeadersData(req)
    : inputData
    ? getDataFromInput(inputData)
    : {
        language: "en",
        isAuthenticated: false,
        ip: ""
      };

  // if (req && !isAuthorized(req)) throw new AuthenticationError("Unauthorized");

  // if (!data.project) throw new Error("Project header is invalid");

  const usecases = getApiUsecases(services);

  const context: ApiContext = {
    ...data,
    services,
    usecases,
    end: async function () {
      // await redis.quit();
      // await dbInstance().destroy();
      this.ended = true;
    },
    ended: false
    // db,
  };

  return context;
}
