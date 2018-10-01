
export default `

interface IForecastDataPoint {
    cloudCover: Float
    dewPoint: Float
    humidity: Float
    icon: Int!
    night: Boolean
    ozone: Float
    precipAccumulation: Float
    precipIntensity: Float
    precipProbability: Float
    precipType: String
    pressure: Float
    temperature: Float!
    time: Int!
    uvIndex: Float
    visibility: Float
    windDir: String
    windGust: Float
    windSpeed: Float
}

type HourlyForecastDataPoint implements IForecastDataPoint {
    cloudCover: Float
    dewPoint: Float
    humidity: Float
    icon: Int!
    night: Boolean
    ozone: Float
    precipAccumulation: Float
    precipIntensity: Float
    precipProbability: Float
    precipType: String
    pressure: Float
    temperature: Float!
    time: Int!
    uvIndex: Float
    visibility: Float
    windDir: String
    windGust: Float
    windSpeed: Float
}

type HoursForecastDataPoint implements IForecastDataPoint {
    cloudCover: Float
    dewPoint: Float
    humidity: Float
    icon: Int!
    night: Boolean
    ozone: Float
    precipAccumulation: Float
    precipIntensity: Float
    precipProbability: Float
    precipType: String
    pressure: Float
    temperature: Float!
    time: Int!
    uvIndex: Float
    visibility: Float
    windDir: String
    windGust: Float
    windSpeed: Float

    temperatureHigh: Float
    temperatureHighTime: Int
    temperatureLow: Float
    temperatureLowTime: Int

    #uvIndexTime: Int
}

type DailyForecastDataPoint implements IForecastDataPoint {
    cloudCover: Float
    dewPoint: Float
    humidity: Float
    icon: Int!
    night: Boolean
    ozone: Float
    precipAccumulation: Float
    precipIntensity: Float
    precipProbability: Float
    precipType: String
    pressure: Float
    temperature: Float!
    time: Int!
    uvIndex: Float
    visibility: Float
    windDir: String
    windGust: Float
    windSpeed: Float

    temperatureHigh: Float
    temperatureHighTime: Int
    temperatureLow: Float
    temperatureLowTime: Int

    moonPhase: Float

    sunriseTime: Int
    sunsetTime: Int
}

interface IForecastDataBlock {
    icon: Int!
    night: Boolean
}

type HourlyForecastDataBlock implements IForecastDataBlock {
    icon: Int!
    night: Boolean
    data: [HourlyForecastDataPoint]!
}

type HoursForecastDataBlock implements IForecastDataBlock {
    icon: Int!
    night: Boolean
    data: [HoursForecastDataPoint]!
}

type DailyForecastDataBlock implements IForecastDataBlock {
    icon: Int!
    night: Boolean
    data: [DailyForecastDataPoint]!
}

# ForecastReport
type ForecastReport {
    latitude: Float!
    longitude: Float!
    timezone: String!
    units: String!
    hourly: HourlyForecastDataBlock
    details: HoursForecastDataBlock
    daily: DailyForecastDataBlock
}

input InputTimezoneGeoPoint {
    longitude: Float!
    latitude: Float!
    timezone: String!
}

extend type Query {
  weather_forecastReport(place: InputTimezoneGeoPoint!): ForecastReport
  weather_datePlacesForecast(places: [InputTimezoneGeoPoint]!, date: String!): [DailyForecastDataPoint]
  weather_nowPlaceForecast(place: InputTimezoneGeoPoint!): HourlyForecastDataPoint
}
`;
