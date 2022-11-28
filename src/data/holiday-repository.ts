import { getHolidays } from "public-holidays";
import { SECONDS_3H } from "../utils";
import { CacheStorage } from "./cache-storage";

export type HolidaysGetParams = {
  country: string;
  lang: string;
  start?: number;
  end?: number;
};

export interface HolidayRepository {
  get(params: HolidaysGetParams): Promise<PublicHoliday[]>;
}

export class CacheHolidayRepository implements HolidayRepository {
  constructor(private storage: CacheStorage) {}

  async get(params: HolidaysGetParams) {
    const key = `holidays:${params.country}_${params.lang}_${
      params.start || 0
    }_${params.end || 0}`;

    return this.storage.executeCached(key, SECONDS_3H, async () => {
      const data = await getHolidays({
        country: params.country,
        lang: params.lang,
        start: (params.start && new Date(params.start * 1000)) || undefined,
        end: (params.end && new Date(params.end * 1000)) || undefined,
        timeout: 2 * 1000
      });

      return (data || []).map((item) => ({
        name: item.name,
        date: Math.floor(item.date.getTime() / 1000)
      }));
    });
  }
}

export type PublicHoliday = {
  date: number;
  name: string;
};
