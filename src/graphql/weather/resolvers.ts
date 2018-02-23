
import { TimezoneGeoPoint } from '@ournet/weather-domain';

import { Data } from '../../data';

export default {
    Query: {
        weather_forecastReport: (_: any, args: { place: TimezoneGeoPoint }) => {
            return Data.weather.getReport(args.place)
        },
        weather_datePlacesForecast: (_: any, args: { places: TimezoneGeoPoint[], date: number }) => {
            return Data.weather.datePlacesForecast(args.places, args.date)
        },
        weather_nowPlaceForecast: (_: any, args: { place: TimezoneGeoPoint }) => {
            return Data.weather.nowPlaceForecast(args.place)
        }
    }
}
