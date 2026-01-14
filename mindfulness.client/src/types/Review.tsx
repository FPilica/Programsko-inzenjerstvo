interface Review {
  id: number;
  rating: number;
  comment?: string;
  date: string;
  userId: string;
  contentId: number;
}

export type { Review };