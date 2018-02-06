
const debug = require('debug')('ournet-api');
import * as WeatherDomain from '@ournet/weather-domain';
import * as WeatherData from '@ournet/weather-data';
import * as LRU from 'lru-cache';
const ms = require('ms');

WeatherData.createDbTables();

const getReport = new WeatherDomain.GetReport(
    new WeatherData.DetailsReportRepository(),
    new WeatherData.HourlyReportRepository(),
    new WeatherDomain.MetnoFetchForecast());

const FORECAST_REPORT_CACHE = new LRU<string, WeatherDomain.ForecastReport>({
    max: 100,
    maxAge: ms('1h'),
});

export default {
    getReport(params: WeatherDomain.TimezoneGeoPoint) {
        const normalizedParams = WeatherDomain.ForecastHelpers.normalizeReportId(params);
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
    }
}
