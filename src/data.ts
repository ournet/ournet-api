const WeatherDomain = require('@ournet/weather-domain');
const WeatherData = require('@ournet/weather-data');

WeatherData.createDbTables();

const getReport = new WeatherDomain.GetReport(
    new WeatherData.DetailsReportRepository(),
    new WeatherData.HourlyReportRepository(),
    new WeatherDomain.MetnoFetchForecast());

export const Data = {
    weather: {
        getReport
    }
}
