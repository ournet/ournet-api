import {
  ArticleService,
  ArticleContentService,
} from "../domain/article/service/article-service";
import { ArticleContentDynamoService } from "../services/article/article-content-repository";
import { ArticleDynamoService } from "../services/article/article-repository";
import { CacheStorage } from "../domain/base/cache-storage";
import { ImageService } from "../domain/image/service/image-service";
import { ImageDynamoService } from "../services/image/image-service";

export interface ApiServices {
  article: ArticleService;
  articleContent: ArticleContentService;
  image: ImageService;
}

let instance: ApiServices;

const createServices = (_cacheStorage: CacheStorage) => {
  const article = new ArticleDynamoService();
  const articleContent = new ArticleContentDynamoService();
  const image = new ImageDynamoService();

  const services: ApiServices = {
    article,
    articleContent,
    image,
  };

  return services;
};

export const getApiServices = (cacheStorage: CacheStorage) => {
  if (instance) return instance;

  instance = createServices(cacheStorage);

  return instance;
};
