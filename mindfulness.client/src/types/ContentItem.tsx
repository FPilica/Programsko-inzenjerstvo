interface ContentItem {
  contentId: number;
  title: string;
  description: string;
  contentLink?: string;
  thumbnailLink?: string;
  contentType: "video" | "article";
  userId: string;
  contentCategory: string;
  duration?: string;
}

export type { ContentItem };