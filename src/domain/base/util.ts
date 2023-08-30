/* eslint-disable @typescript-eslint/no-explicit-any */
import { ulid } from "ulid";
import objectHashFn from "object-hash";
import slugFn from "slug";
import crypto from "crypto";
import ms from "ms";
import normalizeUrlFn from "normalize-url";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const tldExtract = require("tld-extract");

// eslint-disable-next-line @typescript-eslint/no-var-requires
const atonic = require("atonic");

export const isValidTimeInterval = (interval: string) => isNumber(ms(interval));
export const checkTimeInterval = (interval: string) => {
  if (!isValidTimeInterval(interval))
    throw new Error(`Invalid interval: ${interval}`);
};

export const objectHash = (data: object): string =>
  objectHashFn(data, { algorithm: "md5" });

export const dataIsEqual = (
  obj1: object,
  obj2: object,
  options?: objectHashFn.NormalOption
) => {
  if (obj1 === obj2) return true;
  return objectHashFn(obj1, options) === objectHashFn(obj2, options);
};

export const md5 = (input: string) =>
  crypto.createHash("md5").update(input).digest("hex").toLowerCase();

export const removeDiacritics = (str: string): string => atonic(str);

export const slugify = (name: string) =>
  slugFn(
    name
      .replace(/[\s_]+/g, " ")
      .trim()
      .toLowerCase()
  )
    .replace(/-$/, "")
    .replace(/^-/, "");

/**
 * Generate an uniq id.
 */
export function generateUniqueId() {
  return ulid().toLowerCase();
}

/**
 * Generate an uniq short id.
 */
export function generateShortUniqueId() {
  return ulid().toLowerCase().substring(6);
}

export const isNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);

export const isPositiveNumber = (value: unknown): value is number =>
  isNumber(value) && value >= 0;

/**
 * Generate a random int
 * @param min min value
 * @param max max value
 */
export function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const omitFieldsByValue = <T extends object>(
  obj: T,
  values: unknown[]
): T => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result: any = { ...obj };
  for (const key of Object.keys(result))
    if (values.includes(result[key])) delete result[key];
  return result as T;
};

export const omitNullFields = <T extends object>(obj: T): T =>
  omitFieldsByValue(obj, [null]);

export const dateAddDays = (count: number, date: Date = new Date()) => {
  const output = new Date(date);
  output.setDate(date.getDate() + count);
  return output;
};

export const uniq = <T>(arr: T[]) => [...new Set(arr)];

/**
 * Checks if value is not one of: undefined, null, or empty string
 * @param value any value
 * @returns
 */
export const hasValue = (value?: unknown) =>
  ![undefined, null, ""].includes(value as never);

export const isEmptyArray = (value: unknown) =>
  Array.isArray(value) && value.length === 0;

export const removePropsByValue = <T>(obj: T, values: unknown[]) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const output: any = { ...obj };
  const includesEmptyArray = !!values.find(isEmptyArray);
  for (const prop of Object.keys(output)) {
    const value = output[prop];
    if (values.includes(value) || (includesEmptyArray && isEmptyArray(value)))
      delete output[prop];
  }

  return output as T;
};

export const toArray = <T>(input?: T | T[]): T[] =>
  [null, undefined].includes(input as never)
    ? ([] as T[])
    : Array.isArray(input)
    ? (input as T[])
    : ([input] as T[]);

export const uniqBy = <T extends object | string>(
  arr: T[],
  prop: keyof T | ((item: T) => unknown)
): T[] => {
  const props = arr.map((item) =>
    typeof prop === "function" ? prop(item) : (item as any)[prop]
  );
  return arr.filter((_, index) => props.indexOf(props[index]) === index);
};

export const inSeconds = (input: string | number) =>
  Math.round((typeof input === "string" ? ms(input) : input * 1000) / 1000);

export const convertFields = <T extends object>(
  fields: (keyof T)[],
  obj: T,
  fn: (value: unknown) => unknown
): T => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const output: any = { ...obj };
  for (const field of fields) {
    const value = output[field];
    if (value !== undefined) output[field] = fn(value);
  }

  return output as T;
};

export const convertFieldsToInt = <T extends object>(
  fields: (keyof T)[],
  obj: T
): T => convertFields(fields, obj, (value) => parseInt(value as string, 10));

export type LimitNumberOptions = {
  min: number;
  max: number;
  defMin?: number | null;
  defMax?: number | null;
};

export const limitNumber = (
  value: number | undefined,
  { min, defMin, max, defMax }: LimitNumberOptions
) => {
  if (!isNumber(value)) return value;
  if (value < min) return defMin;
  if (value > max) return defMax;
  return value;
};

export const limitRealNumber = (
  value: number | undefined,
  defMin?: number | null,
  defMax?: number | null
) => limitNumber(value, { min: 1e-37, max: 1e37, defMax, defMin });

export const isPlainObject = (value?: any) => value?.constructor === Object;

export type UrlDetails = {
  url: string;
  domain: string;
  normalizedUrl: string;
  hash: string;
  host: string;
  pathname: string;
};

export const stripUrlHash = (url: string) => url.split("#")[0].trim();

export const urlDetails = (url: string): UrlDetails => {
  try {
    const normalizedUrl = normalizeUrl(url);
    const { domain } = tldExtract(normalizedUrl);
    const u = new URL(normalizedUrl);
    const host = u.host.toLowerCase();

    const hash = md5(normalizedUrl.trim().toLowerCase());

    return { url, domain, normalizedUrl, hash, host, pathname: u.pathname };
  } catch (e) {
    throw new Error(`Invalid URL: ${url}`);
  }
};

export const normalizeUrl = (url: string) => {
  url = url.trim();

  // don't change the options without testing:
  const normalizedUrl = normalizeUrlFn(url, {
    forceHttps: true,
    normalizeProtocol: true,
    stripHash: true,
    stripWWW: true,
    removeTrailingSlash: true,
    sortQueryParameters: true,
    stripAuthentication: true,
    stripProtocol: false
  });

  return normalizedUrl;
};

export const fixUrl = (url: string) => {
  const normalizedUrl = normalizeUrl(url);
  const { domain, pathname, host } = urlDetails(normalizedUrl);
  if (domain === "linkedin.com" && pathname.startsWith("/in/"))
    return `https://${host}${pathname}`;
  return normalizedUrl;
};

export const isValidUrl = (url?: string | null): url is string => {
  if (!url) return false;
  try {
    const u = new URL(url).toString().toLowerCase();
    urlDetails(u);
    return /^https?:/.test(u);
  } catch {
    return false;
  }
};

export const urlRemoveAfterPath = (url: string) => {
  const u = new URL(url);
  u.search = "";
  u.hash = "";
  return u.toString();
};

export type RepoUrlDetails = UrlDetails & {
  orgOrUser?: string;
  repo?: string;
  repoFullName?: string;
};

export const repoUrlDetails = (url: string): RepoUrlDetails => {
  const output = urlDetails(url) as RepoUrlDetails;

  const r =
    /^(?:[a-z]+:)?(?:\/\/)?(?:[a-z]+\.)?github\.com[/]+([^/?\s#&]+)(?:[/]+([^/?\s#&]+))?/i.exec(
      url
    );

  if (r) {
    output.orgOrUser = r[1];
    if (r[2]) {
      output.repo = r[2];
      output.repoFullName = `${output.orgOrUser}/${output.repo}`;
    }
  }

  return output;
};

// export const isRepoUrl = (url: string) =>
//   /github\.com\/[^/?\s#&]+\/[^/?\s#&]+/i.test(url);

export const isSocialUrl = (url: string) => {
  if (!isValidUrl(url)) return false;
  const { domain } = urlDetails(url);
  if (
    [
      "twitter.com",
      "facebook.com",
      "instagram.com",
      "linkedin.com",
      "youtube.com",
      "youtu.be",
      "t.co",
      "reddit.com",
      "medium.com",
      "tiktok.com",
      "pinterest.com",
      "snapchat.com",
      "tumblr.com",
      "quora.com",
      "dev.to"
    ].includes(domain)
  )
    return true;

  return false;
};

export const isCodeUrl = (url: string) => {
  if (!isValidUrl(url)) return false;
  const { domain } = urlDetails(url);
  if (["github.com", "github.io"].includes(domain)) return true;

  return false;
};

export const urlHasPath = (url: string) => urlDetails(url).pathname.length > 1;
export const isSocialProfileUrl = (url: string) =>
  isSocialUrl(url) && urlHasPath(url);
