
export default `

type Video {
    id: String!
    sourceId: String!
    sourceType: String!
    websites: [String]!
    createdAt: String!
    expiresAt: Int!

    width: Int
    height: Int

    countViews: Int!
}

extend type Query {
    videos_videoById(id: String!): Video
    videos_videosByIds(ids: [String!]!): [Video]!
}
`;
