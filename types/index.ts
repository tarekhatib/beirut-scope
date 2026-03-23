import type { Article, Category, QuickUpdate } from "@prisma/client";

export type { Article, Category, QuickUpdate };

export type ArticleWithCategory = Article & {
  category: Category;
};
