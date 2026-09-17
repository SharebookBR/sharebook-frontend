export interface ShowcaseBookItem {
  id: string;
  title: string;
  author: string;
  slug: string;
  imageUrl: string;
  thumbnailUrl?: string;
  type: string;
}

export interface CategoryShowcase {
  id: string;
  name: string;
  books: ShowcaseBookItem[];
}
