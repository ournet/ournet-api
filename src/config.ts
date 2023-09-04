require("dotenv").config();

export interface Config {
  readonly MONGO_DB_CONNECTION: string;

  readonly NEWS_ES_HOST: string;

  readonly AWS_ACCESS_KEY_ID: string;
  readonly AWS_SECRET_ACCESS_KEY: string;
  readonly AWS_REGION: string;
  readonly AWS_IMAGES_BUCKET: string;

  readonly PLACES_ES_HOST: string;

  readonly REDISCLOUD_URL: string;

  readonly OURNET_API_KEY: string;
}

export function getConfigFromEnv(): Config {
  const config: Config = {
    MONGO_DB_CONNECTION: process.env.MONGO_DB_CONNECTION || "",
    NEWS_ES_HOST: process.env.NEWS_ES_HOST || "",
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID || "",
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || "",
    AWS_REGION: process.env.AWS_REGION || "",
    PLACES_ES_HOST: process.env.PLACES_ES_HOST || "",
    REDISCLOUD_URL: process.env.REDISCLOUD_URL || "",
    OURNET_API_KEY: process.env.OURNET_API_KEY || "",
    AWS_IMAGES_BUCKET: process.env.AWS_IMAGES_BUCKET || "",
  };

  validateConfig(config);

  return config;
}

function validateConfig(config: Config) {
  if (!config.MONGO_DB_CONNECTION)
    throw new Error("MONGO_DB_CONNECTION is required!");
  if (!config.NEWS_ES_HOST) throw new Error("NEWS_ES_HOST is required!");
  if (!config.PLACES_ES_HOST) throw new Error("PLACES_ES_HOST is required!");
  if (!config.REDISCLOUD_URL) throw new Error("REDISCLOUD_URL is required!");
  if (!config.OURNET_API_KEY) throw new Error("OURNET_API_KEY is required!");
  if (!config.AWS_IMAGES_BUCKET)
    throw new Error("AWS_IMAGES_BUCKET is required!");
}

export default getConfigFromEnv();
