
import { Db } from 'mongodb';
import DynamoDB = require('aws-sdk/clients/dynamodb');

import { TopicRepositoryBuilder } from '@ournet/topics-data';
import { TopicRepository } from '@ournet/topics-domain';
import { NewsRepositoryBuilder, EventRepositoryBuilder, ArticleContentRepositoryBuilder } from '@ournet/news-data';
import { ImageRepositoryBuilder } from '@ournet/images-data';
import { QuoteRepositoryBuilder } from '@ournet/quotes-data';
import { NewsRepository, EventRepository, ArticleContentRepository } from '@ournet/news-domain';
import { ImageRepository } from '@ournet/images-domain';
import { QuoteRepository } from '@ournet/quotes-domain';
import { GetReport, MetnoFetchForecast, ReportRepository } from '@ournet/weather-domain';
import { ServiceConfigurationOptions } from 'aws-sdk/lib/service';
import { ForecastReportRepositoryBuilder } from '@ournet/weather-data';
import { PlaceRepository } from '@ournet/places-domain';
import { PlaceRepositoryBuilder } from '@ournet/places-data';
import { CachePlaceRepository } from './cache-place-repository';
import { HolidayRepository, CacheHolidayRepository } from './holiday-repository';
import { WeatherRepository, CacheWeatherRepository } from './weather-repository';

export interface DataService {
    readonly topicRep: TopicRepository
    readonly newsRep: NewsRepository
    readonly eventRep: EventRepository
    readonly articleContentRep: ArticleContentRepository
    readonly imageRep: ImageRepository
    readonly quoteRep: QuoteRepository
    readonly weatherRep: WeatherRepository
    readonly placeRep: PlaceRepository
    readonly holidayRep: HolidayRepository

    init(): Promise<void>
}

export type DataServiceParams = {
    topicsDb: Db
    newsESHost: string
    placesESHost: string
}

export class DbDataService implements DataService {
    readonly topicRep: TopicRepository
    readonly newsRep: NewsRepository
    readonly eventRep: EventRepository
    readonly articleContentRep: ArticleContentRepository
    readonly imageRep: ImageRepository
    readonly quoteRep: QuoteRepository
    readonly weatherRep: WeatherRepository
    readonly placeRep: PlaceRepository
    readonly holidayRep: HolidayRepository
    private weatherReportRep: ReportRepository

    constructor(params: DataServiceParams, dynamoOptions?: ServiceConfigurationOptions) {
        const dynamoClient = new DynamoDB.DocumentClient(dynamoOptions);
        this.topicRep = TopicRepositoryBuilder.build(params.topicsDb);
        this.newsRep = NewsRepositoryBuilder.build(dynamoClient, params.newsESHost);
        this.eventRep = EventRepositoryBuilder.build(dynamoClient);
        this.articleContentRep = ArticleContentRepositoryBuilder.build(dynamoClient);
        this.imageRep = ImageRepositoryBuilder.build(dynamoClient);
        this.quoteRep = QuoteRepositoryBuilder.build(dynamoClient);
        this.placeRep = new CachePlaceRepository(PlaceRepositoryBuilder.build(dynamoClient, params.placesESHost));

        this.weatherReportRep = ForecastReportRepositoryBuilder.build(dynamoClient);
        this.weatherRep = new CacheWeatherRepository(new GetReport(this.weatherReportRep, this.weatherReportRep, new MetnoFetchForecast()));

        this.holidayRep = new CacheHolidayRepository();
    }

    async init() {
        await this.articleContentRep.createStorage();
        await this.eventRep.createStorage();
        await this.imageRep.createStorage();
        await this.newsRep.createStorage();
        await this.placeRep.createStorage();
        await this.quoteRep.createStorage();
        await this.topicRep.createStorage();
        await this.weatherReportRep.createStorage();
    }
}
