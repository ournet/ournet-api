import { TimezoneGeoPoint } from "@ournet/weather-domain";
import { Context } from "../../context";

export default {
  Query: {
    weather_forecastReport: (
      _: any,
      args: { place: TimezoneGeoPoint },
      context: Context
    ) => {
      return context.data.weatherRep.getReport(args.place).catch((error) => {
        console.error(error);
        return null;
      });
    },
    weather_datePlacesForecast: (
      _: any,
      args: { places: TimezoneGeoPoint[]; date: string },
      context: Context
    ) => {
      return context.data.weatherRep.datePlacesForecast(args.places, args.date);
    },
    weather_nowPlaceForecast: (
      _: any,
      args: { place: TimezoneGeoPoint },
      context: Context
    ) => {
      return context.data.weatherRep.nowPlaceForecast(args.place);
    }
  }
};
