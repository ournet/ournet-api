
export default `

# scalar JSON

interface IForecastDataPoint {
    cloudCover: Float
    dewPoint: Float
    humidity: Float
    icon: String
    night: Boolean
    ozone: Float
    precipAccumulation: Float
    precipIntensity: Float
    precipProbability: Float
    precipType: String
    pressure: Float
    temperature: Float
    time: Int!
    uvIndex: Float
    visibility: Float
    windBearing: Float
    windGust: Float
    windSpeed: Float
}

type HourlyForecastDataPoint implements IForecastDataPoint {
    cloudCover: Float
    dewPoint: Float
    humidity: Float
    icon: String
    night: Boolean
    ozone: Float
    precipAccumulation: Float
    precipIntensity: Float
    precipProbability: Float
    precipType: String
    pressure: Float
    temperature: Float
    time: Int!
    uvIndex: Float
    visibility: Float
    windBearing: Float
    windGust: Float
    windSpeed: Float
}

type HoursForecastDataPoint implements IForecastDataPoint {
    cloudCover: Float
    dewPoint: Float
    humidity: Float
    icon: String
    night: Boolean
    ozone: Float
    precipAccumulation: Float
    precipIntensity: Float
    precipProbability: Float
    precipType: String
    pressure: Float
    temperature: Float
    time: Int!
    uvIndex: Float
    visibility: Float
    windBearing: Float
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
    icon: String
    night: Boolean
    ozone: Float
    precipAccumulation: Float
    precipIntensity: Float
    precipProbability: Float
    precipType: String
    pressure: Float
    temperature: Float
    time: Int!
    uvIndex: Float
    visibility: Float
    windBearing: Float
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
    icon: String!
    night: Boolean
    data: [IForecastDataPoint]!
}

type HourlyForecastDataBlock implements IForecastDataBlock {
    icon: String!
    night: Boolean
    data: [HourlyForecastDataPoint]!
}

type HoursForecastDataBlock implements IForecastDataBlock {
    icon: String!
    night: Boolean
    data: [HoursForecastDataPoint]!
}

type DailyForecastDataBlock implements IForecastDataBlock {
    icon: String!
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

extend type Query {
  weather_forecastReport(longitude: Float!, latitude: Float!, timezone: String!): ForecastReport
}
`;
