import { BaseUseCase } from "../../base/usecase";
import {
  ArticleService,
  ArticleContentService
} from "../service/article-service";

export type DeleteArticleInput = {
  id: string;
};

export class DeleteArticleUsecase extends BaseUseCase<
  DeleteArticleInput,
  boolean
> {
  constructor(
    private articleService: ArticleService,
    private articleContentService: ArticleContentService
  ) {
    super();
  }

  protected async innerExecute({ id }: DeleteArticleInput): Promise<boolean> {
    await this.articleService.deleteById(id);
    await this.articleContentService.deleteById(id);
    return true;
  }
}
