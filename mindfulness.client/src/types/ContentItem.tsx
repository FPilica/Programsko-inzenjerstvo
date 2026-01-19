interface ContentItem {
  contentId?: number;
  title: string;
  description: string;
  contentLink?: string;
  thumbnailLink?: string;
  contentType: "video" | "article";
  userId?: string;
  categoryId?: string;
  audioLanguageId?: string
  duration?: string;
}

export type { ContentItem };