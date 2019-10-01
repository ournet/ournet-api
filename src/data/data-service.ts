import { Db } from "mongodb";
import DynamoDB = require("aws-sdk/clients/dynamodb");

import { TopicRepositoryBuilder } from "@ournet/topics-data";
import { TopicRepository } from "@ournet/topics-domain";
import {
  NewsRepositoryBuilder,
  EventRepositoryBuilder,
  ArticleContentRepositoryBuilder
} from "@ournet/news-data";
import { ImageRepositoryBuilder } from "@ournet/images-data";
import { QuoteRepositoryBuilder } from "@ournet/quotes-data";
import {
  NewsRepository,
  EventRepository,
  ArticleContentRepository
} from "@ournet/news-domain";
import { ImageRepository } from "@ournet/images-domain";
import { QuoteRepository } from "@ournet/quotes-domain";
import {
  GetReport,
  MetnoFetchForecast,
  ReportRepository
} from "@ournet/weather-domain";
import { ServiceConfigurationOptions } from "aws-sdk/lib/service";
import { ForecastReportRepositoryBuilder } from "@ournet/weather-data";
import { PlaceRepository } from "@ournet/places-domain";
import { PlaceRepositoryBuilder } from "@ournet/places-data";
import { CachePlaceRepository } from "./cache-place-repository";
import {
  HolidayRepository,
  CacheHolidayRepository
} from "./holiday-repository";
import {
  WeatherRepository,
  CacheWeatherRepository
} from "./weather-repository";
import {
  HoroscopeReportRepository,
  HoroscopePhraseRepository,
  CacheHoroscopeReportRepository
} from "./horoscope-repository";
import {
  PhraseRepositoryBuilder,
  ReportRepositoryBuilder
} from "@ournet/horoscopes-data";
import { CacheEventRepository } from "./cache-event-repository";
import { CacheTopicRepository } from "./cache-topic-repository";
import { CacheQuoteRepository } from "./cache-quote-repository";
import { VideoRepository } from "@ournet/videos-domain";
import { VideoRepositoryBuilder } from "@ournet/videos-data";
import { CacheVideoRepository } from "./cache-video-repository";
import CocoshelService from "./cocoshel-service";

export interface DataService {
  readonly topicRep: TopicRepository;
  readonly newsRep: NewsRepository;
  readonly eventRep: EventRepository;
  readonly articleContentRep: ArticleContentRepository;
  readonly imageRep: ImageRepository;
  readonly quoteRep: QuoteRepository;
  readonly weatherRep: WeatherRepository;
  readonly placeRep: PlaceRepository;
  readonly holidayRep: HolidayRepository;
  readonly horoReportRep: HoroscopeReportRepository;
  readonly horoPhraseRep: HoroscopePhraseRepository;
  readonly videoRep: VideoRepository;
  readonly cocoshel: CocoshelService;

  init(): Promise<void>;
}

export type DataServiceParams = {
  mongoDb: Db;
  newsESHost: string;
  placesESHost: string;
  mongoConnectionString: string;
};

export class DbDataService implements DataService {
  readonly topicRep: TopicRepository;
  readonly newsRep: NewsRepository;
  readonly eventRep: EventRepository;
  readonly articleContentRep: ArticleContentRepository;
  readonly imageRep: ImageRepository;
  readonly quoteRep: QuoteRepository;
  readonly weatherRep: WeatherRepository;
  readonly placeRep: PlaceRepository;
  readonly holidayRep: HolidayRepository;
  readonly horoReportRep: HoroscopeReportRepository;
  readonly horoPhraseRep: HoroscopePhraseRepository;
  readonly videoRep: VideoRepository;
  readonly cocoshel: CocoshelService;

  private weatherReportRep: ReportRepository;

  constructor(
    params: DataServiceParams,
    dynamoOptions?: ServiceConfigurationOptions
  ) {
    const dynamoClient = new DynamoDB.DocumentClient(dynamoOptions);
    this.topicRep = new CacheTopicRepository(
      TopicRepositoryBuilder.build(params.mongoDb)
    );
    this.horoPhraseRep = PhraseRepositoryBuilder.build(params.mongoDb);
    this.horoReportRep = new CacheHoroscopeReportRepository(
      ReportRepositoryBuilder.build(params.mongoDb)
    );
    this.newsRep = NewsRepositoryBuilder.build(dynamoClient, params.newsESHost);
    this.eventRep = new CacheEventRepository(
      EventRepositoryBuilder.build(dynamoClient)
    );
    this.articleContentRep = ArticleContentRepositoryBuilder.build(
      dynamoClient
    );
    this.imageRep = ImageRepositoryBuilder.build(dynamoClient);
    this.quoteRep = new CacheQuoteRepository(
      QuoteRepositoryBuilder.build(dynamoClient)
    );
    this.placeRep = new CachePlaceRepository(
      PlaceRepositoryBuilder.build(dynamoClient, params.placesESHost)
    );

    this.weatherReportRep = ForecastReportRepositoryBuilder.build(dynamoClient);
    this.weatherRep = new CacheWeatherRepository(
      new GetReport(
        this.weatherReportRep,
        this.weatherReportRep,
        new MetnoFetchForecast()
      )
    );

    this.holidayRep = new CacheHolidayRepository();

    this.videoRep = new CacheVideoRepository(
      VideoRepositoryBuilder.build(dynamoClient)
    );

    this.cocoshel = new CocoshelService(params.mongoConnectionString);
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
    await this.horoPhraseRep.createStorage();
    await this.horoReportRep.createStorage();
    await this.videoRep.createStorage();
  }
}
