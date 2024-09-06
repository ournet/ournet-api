import { BaseUseCase } from "../../base/usecase";
import { ArticleContentUpdateData } from "../entity/acticle-content";
import { Article, ArticleUpdateData } from "../entity/article";
import {
  ArticleService,
  ArticleContentService
} from "../service/article-service";

export type UpdateArticleInput = Omit<
  ArticleUpdateData,
  | "createdAt"
  | "updatedAt"
  | "projectKey"
  | "countViews"
  | "slug"
  | "lang"
  | "country"
> &
  Pick<ArticleContentUpdateData, "format" | "content">;

export class UpdateArticleUsecase extends BaseUseCase<
  UpdateArticleInput,
  Article
> {
  constructor(
    private articleService: ArticleService,
    private articleContentService: ArticleContentService
  ) {
    super();
  }

  protected async innerExecute({
    id,
    content,
    format,
    ...input
  }: UpdateArticleInput): Promise<Article> {
    let article = await this.articleService.checkById(id);
    const updateData: UpdateArticleInput = {
      ...input,
      id
    };

    if (Object.keys(updateData).length > 1)
      article = await this.articleService.update(updateData);

    if (content || format) {
      await this.articleContentService.update({
        id,
        content,
        format
      });
    }

    return article;
  }
}
