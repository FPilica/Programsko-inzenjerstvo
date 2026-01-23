interface ContentItem {
  id?: string;
  title: string;
  description: string;
  contentLink?: string;
  thumbnailLink?: string;
  contentType: "video" | "article";
  userId?: string;
  contentCategory?: string;
  audioLanguage?: string;
  categoryId?: string;
  audioLanguageId?: string
  duration?: string;
}

export type { ContentItem };