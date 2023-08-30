import { CreateArticleUsecase } from "../domain/article/usecase/create-article-usecase";
import { DeleteArticleUsecase } from "../domain/article/usecase/delete-article-usecase";
import { ApiServices } from "./services";

export interface ApiUsecases {
  createArticle: CreateArticleUsecase;
  deleteArticle: DeleteArticleUsecase;
}

let instance: ApiUsecases;

const create = (services: ApiServices) => {
  const createArticle = new CreateArticleUsecase(
    services.article,
    services.articleContent
  );
  const deleteArticle = new DeleteArticleUsecase(
    services.article,
    services.articleContent
  );

  const usecases: ApiUsecases = {
    createArticle,
    deleteArticle
  };

  return usecases;
};

export const getApiUsecases = (services: ApiServices) => {
  if (instance) return instance;

  instance = create(services);

  return instance;
};
