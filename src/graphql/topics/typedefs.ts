
export default `

enum TopicType {
    PLACE
    ORG
    PERSON
    WORK
    EVENT
}

type Topic {
    id: String!
    lang: String!
    country: String!

    wikiId: String

    name: String!
    commonName: String
    englishName: String
    abbr: String
    type: TopicType

    description: String
    about: String

    isActive: Boolean

    createdAt: String!
    updatedAt: String
}

input TopicWikiId  {
    lang: String!
    country: String!
    wikiId: String!
}

extend type Query {
    topics_topicById(id: String!): Topic
    topics_topicsByIds(ids: String!): [Topic]!
    topics_topicsByWikiIds(wikiIds: [TopicWikiId]!): [Topic]!
}
`;
