
export default `

type Place {
    id: String!
    name: String!
    asciiname: String!
    names: String
    latitude: Float!
    longitude: Float!
    featureClass: String!
    featureCode: String
    countryCode: String!
    admin1Code: String!
    admin2Code: String
    admin3Code: String
    population: Int
    elevation: Int
    dem: Int
    timezone: String!
    admin1: Place
}

type PlaceOldId {
    id: Int!
    geonameid: Int!
}

extend type Query {
    places_placeById (id: String!): Place
    places_searchPlace (query: String!, country: String!, limit: Int!, type: String): [Place]
    places_placesByIds(ids: [String]!): [Place]
    places_placesByAdmin1Code(country: String!, admin1Code: String!, limit: Int!): [Place]
    places_mainPlaces(country: String!, limit: Int!): [Place]
    places_admin1s(country: String!, limit: Int!): [Place]
    places_admin1(admin1Code: String!, country: String!): Place
    places_placeOldId(id: Int!): PlaceOldId
}
`;
