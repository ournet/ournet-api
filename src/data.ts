
import * as WeatherDomain from '@ournet/weather-domain';
import * as WeatherData from '@ournet/weather-data';
import * as PlacesData from '@ournet/places-data';

WeatherData.createDbTables();

const getReport = new WeatherDomain.GetReport(
    new WeatherData.DetailsReportRepository(),
    new WeatherData.HourlyReportRepository(),
    new WeatherDomain.MetnoFetchForecast());

const weather = {
    getReport
};

const places = {
    access: new PlacesData.PlaceRepository({ esOptions: { host: process.env.PLACES_ES_HOST } }),
};

export const Data = {
    weather,
    places,
}
