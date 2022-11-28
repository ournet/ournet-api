import RedisClass, { Redis } from "ioredis";
import config from "../config";

let redisInstance: Redis;

export const setRedisInstance = (redis: Redis) => {
  redisInstance = redis;
};

export const getRedisInstance = (): Redis => {
  if (!redisInstance) {
    redisInstance = new RedisClass(config.REDISCLOUD_URL);
  }

  return redisInstance;
};
