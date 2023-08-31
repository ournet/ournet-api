/* eslint-disable @typescript-eslint/no-explicit-any */
import { ulid } from "ulid";
import objectHashFn from "object-hash";
import slugFn from "slug";
import crypto from "crypto";
import ms from "ms";
import { ReadStream } from "fs";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const atonic = require("atonic");

export const streamToBuffer = (stream: ReadStream): Promise<Buffer> => {
  return new Promise<Buffer>((resolve, reject) => {
    const _buf: Uint8Array[] = [];

    stream.on("data", (chunk) => _buf.push(chunk as never));
    stream.on("end", () => resolve(Buffer.concat(_buf)));
    stream.on("error", (err) => reject(`error converting stream - ${err}`));
  });
};

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
