
export default `
type Image {
    id: String!
    contentType: String!
    length: Int!
    width: Int!
    height: Int!
    createdAt: String!
    updatedAt: String!
}

extend type Query {
    imageById (id: String!): Image
}
extend type Mutation {
    createImage(url: String!, referer: String): Image!
}
`;
