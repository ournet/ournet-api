
export default `

type NewsItem {
    id: String!
    title: String!
    summary: String!
    lang: String!
    country: String!
    urlPath: String!
    urlHost: String!
    slug: String!

    sourceId: String!
    imagesIds: [String]
    videoId: String
    topics: [NewsTopic]

    eventId: String

    createdAt: String!
    updatedAt: String
    publishedAt: String!
    expiresAt: Int!

    titleHash: String!

    hasContent: Boolean!

    countViews: Int!
    countQuotes: Int!
    quotesIds: [String]
}

type NewsTopic {
    id: String!
    name: String!
    slug: String!
    abbr: String
    type: String
}

enum NewsTopicType {
    PERSON
    ORG
    PLACE
    PRODUCT
    WORK
    EVENT
}

type NewsEvent {
	id: String!
	title: String!
	slug: String!
	summary: String!

	source: NewsEventSource!

	lang: String!
	country: String!
	imageId: String!
	imageHost: String!
	imageSourceId: String!

	countNews: Int!
	countViews: Int!
	countQuotes: Int!
	countVideos: Int!
	countImages: Int!

	topics: [NewsTopic]!

	items: [NewsEventItem]!

	quotesIds: [String]
    videosIds: [String]
    imagesIds: [String]

	status: String

	createdAt: String!
	updatedAt: String
	expiresAt: Int!

	hasContent: Boolean!
}

enum NewsEventStatus {
    ADULT
}

type NewsEventSource {
	id: String!
	host: String!
	path: String!
	sourceId: String!
}

type NewsEventItem {
	id: String!
	title: String!
	sourceId: String!
	host: String!
	path: String!
	publishedAt: String!
}

enum NewsArticleContentFormat {
    text
    md
    json
}

type NewsArticleContent {
    id: String!
    refId: String!
    refType: String!
    content: String!
    format: String!
    formatVersion: Int
    topicsMap: JSON
    expiresAt: Int!
    createdAt: String!
    updatedAt: String
}

enum NewsArticleContentRefType {
    NEWS
    EVENT
}

type NewsArticleContentRef {
    refId: String!
    refType: String!
}

type NewsTopItem {
    id: String!
    count: Int!
}

input NewsSearchParams {
    lang: String!
    country: String!
    q: String!
    limit: Int!
    minScore: Float
    type: String
}

input LatestNewsQueryParams {
    lang: String!
    country: String!
    limit: Int!
    minDate: String
    maxDate: String
}

input LatestNewsBySourceQueryParams {
    lang: String!
    country: String!
    limit: Int!
    minDate: String
    maxDate: String
    sourceId: String!
}

input LatestNewsByTopicQueryParams {
    lang: String!
    country: String!
    limit: Int!
    minDate: String
    maxDate: String
    topicId: String!
}

input LatestNewsByEventQueryParams {
    lang: String!
    country: String!
    limit: Int!
    minDate: String
    maxDate: String
    eventId: String!
}

input CountNewsQueryParams {
    lang: String!
    country: String!
    minDate: String
    maxDate: String
}

input CountNewsBySourceQueryParams {
    lang: String!
    country: String!
    minDate: String
    maxDate: String
    sourceId: String!
}

input CountNewsByTopicQueryParams {
    lang: String!
    country: String!
    minDate: String
    maxDate: String
    topicId: String!
}

input CountNewsByEventQueryParams {
    lang: String!
    country: String!
    minDate: String
    maxDate: String
    eventId: String!
}

input LatestEventsQueryParams {
    lang: String!
    country: String!
    minDate: String
    maxDate: String
    limit: Int!
}

input LatestEventsByTopicQueryParams {
    lang: String!
    country: String!
    minDate: String
    maxDate: String
    limit: Int!
    topicId: String!
}

input TrendingTopicsQueryParams {
    lang: String!
    country: String!
    limit: Int!
    period: String!
}

input CountEventsQueryParams {
    lang: String!
    country: String!
    minDate: String
    maxDate: String
}

input CountEventsByTopicQueryParams {
    lang: String!
    country: String!
    minDate: String
    maxDate: String
    topicId: String!
}

input SimilarEventsByTopicsQueryParams {
    lang: String!
    country: String!
    minDate: String
    maxDate: String
    limit: Int!
    topicIds: [String]!
    exceptId: String
}

extend type Query {
    news_itemById (id: String!): NewsItem
    news_itemsByIds (ids: [String]!): [NewsItem]!
    news_itemsSearch(params: NewsSearchParams!): [NewsItem]!
    news_itemsLatest(params: LatestNewsQueryParams): [NewsItem]!
    news_itemsLatestBySource(params: LatestNewsBySourceQueryParams): [NewsItem]!
    news_itemsLatestByTopic(params: LatestNewsByTopicQueryParams): [NewsItem]!
    news_itemsLatestByEvent(params: LatestNewsByEventQueryParams): [NewsItem]!
    news_itemsCount(params: CountNewsQueryParams): Int!
    news_itemsCountBySource(params: CountNewsBySourceQueryParams): Int!
    news_itemsCountByTopic(params: CountNewsByTopicQueryParams): Int!
    news_itemsCountByEvent(params: CountNewsByEventQueryParams): Int!
    news_topSources(params: LatestNewsQueryParams): [NewsTopItem]!
    news_topSourceTopics(params: LatestNewsBySourceQueryParams): [NewsTopItem]!

    news_eventById (id: String!): NewsEvent
    news_eventsByIds (ids: [String]!): [NewsEvent]!
    news_eventsLatest(params: LatestEventsQueryParams): [NewsEvent]!
    news_eventsLatestByTopic(params: LatestEventsByTopicQueryParams): [NewsEvent]!
    news_eventsCount(params: CountEventsQueryParams): Int!
    news_eventsCountByTopic(params: CountEventsByTopicQueryParams): Int!
    news_topTopics(params: LatestEventsQueryParams): [NewsTopItem]!
    news_trendingTopics(params: TrendingTopicsQueryParams): [NewsTopItem]!

    news_similarEventsByTopics(params: SimilarEventsByTopicsQueryParams): [NewsEvent]!

    news_articleContentById (id: String!): NewsArticleContent
    news_articleContentsByIds (ids: [String]!): [NewsArticleContent]!
}
extend type Mutation {
    news_viewNewsEvent(id: String!): Int!
    news_viewNewsItem(id: String!): Int!
}
`;
