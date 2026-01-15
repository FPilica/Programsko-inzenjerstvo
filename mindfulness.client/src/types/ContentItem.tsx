interface ContentItem {
  contentId: number;
  title: string;
  description: string;
  videoLink?: string;
  posterLink?: string;
  type: "video" | "article";
  authorId: string;
  category: string;
  duration?: string;
}

export type { ContentItem };