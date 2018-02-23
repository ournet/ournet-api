
const debug = require('debug')('ournet-api');
import { GetReport, MetnoFetchForecast, ForecastReport, TimezoneGeoPoint, ForecastHelpers, DailyDataPoint, HourlyDataPoint } from '@ournet/weather-domain';
import * as WeatherData from '@ournet/weather-data';
import * as LRU from 'lru-cache';
import { DetailsReportRepository, HourlyReportRepository } from '@ournet/weather-data';
const ms = require('ms');

WeatherData.createDbTables();

const getReport = new GetReport(
    new DetailsReportRepository(),
    new HourlyReportRepository(),
    new MetnoFetchForecast());

const FORECAST_REPORT_CACHE = new LRU<string, ForecastReport>({
    max: 100,
    maxAge: ms('1h'),
});

const Api = {
    getReport(params: TimezoneGeoPoint) {
        const normalizedParams = ForecastHelpers.normalizeReportId(params);
        const key = `${normalizedParams.longitude}_${normalizedParams.latitude}`.toLowerCase();
        const cacheResult = FORECAST_REPORT_CACHE.get(key);

        if (cacheResult) {
            debug(`forecastReport: got from cache: ${key}`);
            return Promise.resolve(cacheResult);
        }

        return getReport.execute(params)
            .then(repResult => {
                if (repResult) {
                    debug(`forecastReport: set to cache: ${key}`);
                    FORECAST_REPORT_CACHE.set(key, repResult);
                }

                return repResult;
            })
    },

    datePlacesForecast(places: TimezoneGeoPoint[], date: number) {
        const stringDate = date.toString();
        if (stringDate.length !== 8) {
            return Promise.reject(new Error(`Invalid 'date' param`))
        }
        return Promise.all(places.map(place => Api.getReport(place)))
            .then(results => results.map(report => findDayDataPoint(report, stringDate) || null))
    },

    nowPlaceForecast(place: TimezoneGeoPoint) {
        return Api.getReport(place)
            .then(report => findHourDataPoint(report) || null)
    }
}

export default Api;

function findDayDataPoint(report: ForecastReport, stringDate: string): DailyDataPoint {
    const utcDate = Date.UTC(parseInt(stringDate.substr(0, 4)), parseInt(stringDate.substr(4, 2)) - 1, parseInt(stringDate.substr(6, 2)), 0, 0, 0)
    const tzDate = ForecastHelpers.dateToZoneDate(new Date(utcDate), report.timezone)

    return report && report.daily && report.daily.data
        && report.daily.data.find(item => ForecastHelpers.dateToZoneDate(new Date(item.time * 1000), report.timezone) >= tzDate)

}

function findHourDataPoint(report: ForecastReport): HourlyDataPoint {
    const date = new Date()
    date.setMinutes(0, 0, 0)
    const tzDate = ForecastHelpers.dateToZoneDate(date, report.timezone)

    return report && report.hourly && report.hourly.data
        && report.hourly.data.find(item => ForecastHelpers.dateToZoneDate(new Date(item.time * 1000), report.timezone) >= tzDate)
}
