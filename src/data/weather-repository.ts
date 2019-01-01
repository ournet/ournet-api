
const debug = require('debug')('ournet-api');

import {
    GetReport,
    TimezoneGeoPoint,
    ForecastHelper,
    ForecastReport,
    DailyDataPoint,
    HourlyDataPoint,
} from "@ournet/weather-domain";
import LRU from 'lru-cache';
import ms = require('ms');
import { mapPromise } from "@ournet/domain";

export interface WeatherRepository {
    getReport(params: TimezoneGeoPoint): Promise<ForecastReport>
    datePlacesForecast(places: TimezoneGeoPoint[], date: string): Promise<(DailyDataPoint | null)[]>
    nowPlaceForecast(place: TimezoneGeoPoint): Promise<HourlyDataPoint | null>
}

const FORECAST_REPORT_CACHE = new LRU<string, ForecastReport>({
    max: 500,
    maxAge: ms('30m'),
});

export class CacheWeatherRepository {
    constructor(private getReportUseCase: GetReport) { }

    async getReport(params: TimezoneGeoPoint) {
        const normalizedParams = ForecastHelper.normalizeReportId(params);
        const key = `${normalizedParams.longitude}_${normalizedParams.latitude}`.toLowerCase();
        const cacheResult = FORECAST_REPORT_CACHE.get(key);

        if (cacheResult) {
            debug(`forecastReport: got from cache: ${key}`);
            return cacheResult;
        }

        const repResult = await this.getReportUseCase.execute(params)

        if (repResult) {
            debug(`forecastReport: set to cache: ${key}`);
            FORECAST_REPORT_CACHE.set(key, repResult);
        }

        return repResult;
    }

    async datePlacesForecast(places: TimezoneGeoPoint[], date: string) {
        if (date.length !== 10) {
            throw new Error(`Invalid 'date' param`);
        }

        const results = await mapPromise(places, place => this.getReport(place).then(report => findDayDataPoint(report, date)));

        const list: (DailyDataPoint | null)[] = []

        for (const place of places) {
            list.push(results.get(place) || null);
        }

        return list;
    }

    nowPlaceForecast(place: TimezoneGeoPoint) {
        return this.getReport(place).then(report => findHourDataPoint(report))
    }
}

function findDayDataPoint(report: ForecastReport, stringDate: string) {
    if (!report || !report.daily) {
        return null;
    }
    const utcDate = Date.UTC(parseInt(stringDate.substr(0, 4)), parseInt(stringDate.substr(5, 2)) - 1, parseInt(stringDate.substr(8, 2)), 0, 0, 0)
    const tzDate = ForecastHelper.dateToZoneDate(new Date(utcDate), report.timezone)

    return report.daily.data && report.daily.data
        .find(item => ForecastHelper.dateToZoneDate(new Date(item.time * 1000), report.timezone) >= tzDate)
        || null;
}

function findHourDataPoint(report: ForecastReport) {
    const date = new Date()
    date.setMinutes(0, 0, 0)
    const tzDate = ForecastHelper.dateToZoneDate(date, report.timezone)

    return report && report.hourly && report.hourly.data
        && report.hourly.data.find(item => ForecastHelper.dateToZoneDate(new Date(item.time * 1000), report.timezone) >= tzDate)
        || null;
}
