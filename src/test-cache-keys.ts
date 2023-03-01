import { getRedisInstance } from "./data/redis";
// import { writeFileSync } from "fs";

const cache = getRedisInstance();

async function start() {
  // const keys = await cache.keys("*");
  // writeFileSync("temp.txt", keys.join("\n"), "utf-8");
  console.log(await cache.get("cache_Place_getById_1_727895"));
}

start().finally(() => cache.quit());
