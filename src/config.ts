export interface Config {
  readonly MONGO_DB_CONNECTION: string;

  readonly NEWS_ES_HOST: string;

  readonly AWS_ACCESS_KEY_ID: string;
  readonly AWS_SECRET_ACCESS_KEY: string;
  readonly AWS_REGION: string;

  readonly PLACES_ES_HOST: string;

  readonly REDISCLOUD_URL: string;
}

export function getConfigFromEnv(): Config {
  const config: Config = {
    MONGO_DB_CONNECTION: process.env.MONGO_DB_CONNECTION || "",
    NEWS_ES_HOST: process.env.NEWS_ES_HOST || "",
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID || "",
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || "",
    AWS_REGION: process.env.AWS_REGION || "",
    PLACES_ES_HOST: process.env.PLACES_ES_HOST || "",
    REDISCLOUD_URL: process.env.REDISCLOUD_URL || ""
  };

  validateConfig(config);

  return config;
}

function validateConfig(config: Config) {
  if (!config.MONGO_DB_CONNECTION) {
    throw new Error("MONGO_DB_CONNECTION is required!");
  }
  if (!config.NEWS_ES_HOST) {
    throw new Error("NEWS_ES_HOST is required!");
  }
  if (!config.PLACES_ES_HOST) {
    throw new Error("PLACES_ES_HOST is required!");
  }
}

export default getConfigFromEnv();
