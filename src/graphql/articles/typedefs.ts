
export default `

enum ArticleContentFormat {
    MD
}

type ArticleContent {
    id: String!
    format: ArticleContentFormat!
    content: String!
    createdAt: String!
    updatedAt: String!
}

enum ArticleStatus {
    ACTIVE
    INACTIVE
}

enum ArticleType {
    SPONSORED
}

type Article {
    id: String!
    lang: String!
    country: String!
    projectKey: String!
    type: ArticleType!
    title: String!
    slug: String!
    status: ArticleStatus!
    description: String
    imageId: String
    client: String!
    countViews: Int!
    expiresAt: String
    createdAt: String!
    updatedAt: String!
    doFollowLinks: Boolean
    totalCost: Float
    currency: String
    
    content: ArticleContent
}

extend type Query {
    articleById (id: String!): Article
    articleByIds (ids: [String]!): [Article!]!
    findArticle (lang: String!, country: String!, type: ArticleType, status: ArticleStatus, limit: Int!, offset: Int): [Article!]!
}
extend type Mutation {
    viewArticle(id: String!): Int!
    createArticle(lang: String!, country: String!, type: ArticleType!, title: String!, status: ArticleStatus!, description: String, imageId: String, client: String!, content: String!, format: ArticleContentFormat!, doFollowLinks: Boolean, totalCost: Float, currency: String): Article!
    updateArticle(id: ID!, type: ArticleType, title: String, status: ArticleStatus, description: String, imageId: String, client: String, content: String, format: ArticleContentFormat, doFollowLinks: Boolean, totalCost: Float, currency: String): Article!
    deleteArticle(id: String!): Boolean!
}
`;
