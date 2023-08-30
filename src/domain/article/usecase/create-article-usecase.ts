import { BaseUseCase } from "../../base/usecase";
import { ArticleContentCreateData } from "../entity/acticle-content";
import { Article, ArticleCreateData } from "../entity/article";
import {
  ArticleService,
  ArticleContentService
} from "../service/article-service";

export type CreateArticleInput = Omit<
  ArticleCreateData,
  "id" | "createdAt" | "updatedAt" | "projectKey" | "countViews" | "slug"
> &
  Pick<ArticleContentCreateData, "format" | "content">;

export class CreateArticleUsecase extends BaseUseCase<
  CreateArticleInput,
  Article
> {
  constructor(
    private articleService: ArticleService,
    private articleContentService: ArticleContentService
  ) {
    super();
  }

  protected async innerExecute({
    content,
    format,
    ...input
  }: CreateArticleInput): Promise<Article> {
    const createData: ArticleCreateData = {
      ...input,
      id: Article.createId(input),
      projectKey: Article.createProjectKey(input),
      countViews: 0,
      slug: Article.createSlug(input.title)
    };

    const article = await this.articleService.create(createData);

    try {
      await this.articleContentService.create({
        id: article.id,
        format,
        content
      });
    } catch (e) {
      console.error(e);
      await this.articleService.deleteById(article.id);
      throw e;
    }

    return article;
  }
}
