
import { TimezoneGeoPoint } from '@ournet/weather-domain';

import { Data } from '../../data';

export default {
    Query: {
        weather_forecastReport: (_: any, args: TimezoneGeoPoint) => {
            return Data.weather.getReport.execute(args);
        }
    },
    Mutation: {

    },
}
