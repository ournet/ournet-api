
export default `

type PublicHoliday {
    date: Int!
    name: String!
}

extend type Query {
    publicHolidays(country: String!, lang: String!, start: Int, end: Int): [PublicHoliday]
}
`;
