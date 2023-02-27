import {
  GetReport,
  TimezoneGeoPoint,
  ForecastHelper,
  ForecastReport,
  DailyDataPoint,
  HourlyDataPoint
} from "@ournet/weather-domain";
import { mapPromise } from "@ournet/domain";
import { CacheStorage } from "./cache-storage";
import { SECONDS_3H } from "../utils";
import { logger } from "../logger";

export interface WeatherRepository {
  getReport(params: TimezoneGeoPoint): Promise<ForecastReport>;
  datePlacesForecast(
    places: TimezoneGeoPoint[],
    date: string
  ): Promise<(DailyDataPoint | null)[]>;
  nowPlaceForecast(place: TimezoneGeoPoint): Promise<HourlyDataPoint | null>;
}

export class CacheWeatherRepository {
  constructor(
    private getReportUseCase: GetReport,
    private storage: CacheStorage
  ) {}

  async getReport(params: TimezoneGeoPoint) {
    const normalizedParams = ForecastHelper.normalizeReportId(params);
    const key = this.storage.formatKey([
      "weatherGetReport",
      normalizedParams.longitude,
      normalizedParams.latitude
    ]);

    return this.storage.executeCached(key, SECONDS_3H, () =>
      this.getReportUseCase.execute(params)
    );
  }

  async datePlacesForecast(places: TimezoneGeoPoint[], date: string) {
    if (date.length !== 10) {
      throw new Error(`Invalid 'date' param`);
    }

    const results = await mapPromise(places, (place) =>
      this.getReport(place).then((report) => findDayDataPoint(report, date))
    );

    const list: (DailyDataPoint | null)[] = [];

    for (const place of places) {
      list.push(results.get(place) || null);
    }

    return list;
  }

  nowPlaceForecast(place: TimezoneGeoPoint) {
    return this.getReport(place).then((report) => findHourDataPoint(report));
  }
}

function findDayDataPoint(report: ForecastReport, stringDate: string) {
  if (!report || !report.daily) {
    logger.warn(`No daily wheather report`);
    return null;
  }
  const utcDate = new Date(stringDate);
  const tzDate = ForecastHelper.dateToZoneDate(utcDate, report.timezone);

  return (
    (report.daily.data &&
      report.daily.data.find(
        (item) =>
          ForecastHelper.dateToZoneDate(
            new Date(item.time * 1000),
            report.timezone
          ) >= tzDate
      )) ||
    null
  );
}

function findHourDataPoint(report: ForecastReport) {
  const date = new Date();
  date.setMinutes(0, 0, 0);
  const tzDate = ForecastHelper.dateToZoneDate(date, report.timezone);

  return (
    (report &&
      report.hourly &&
      report.hourly.data &&
      report.hourly.data.find(
        (item) =>
          ForecastHelper.dateToZoneDate(
            new Date(item.time * 1000),
            report.timezone
          ) >= tzDate
      )) ||
    null
  );
}
