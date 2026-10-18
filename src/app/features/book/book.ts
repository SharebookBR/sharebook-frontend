import { Category } from 'src/app/features/category/category';
import { BookDonationStatus } from './BookDonationStatus';

export type BookType = 'Printed' | 'Eletronic';

export interface BookCategoryInfo {
  id: string;
  name: string;
  parentCategoryId?: string | null;
  parentCategoryName?: string | null;
}

export interface BookDonorInfo {
  displayName: string;
  linkedin?: string | null;
}

export interface TagSummary {
  id: string;
  name: string;
  family: string;
}

export class Book {
  title: string;
  author: string;
  slug: string;
  imageBytes: string;
  imageSlug: string;
  freightOption: string;
  userId: string;
  categoryId: string;
  downloadCount?: number;
  category: Category | string;
  categoryInfo?: BookCategoryInfo;
  imageUrl: string;
  thumbnailUrl?: string;
  imageName: string;
  chooseDate: Date;
  releaseDate?: string | null;
  synopsis: string;
  id: string;
  creationDate: Date;
  status: BookDonationStatus;
  city: string;
  state: string;
  type: BookType;
  pdfBytes?: string;
  eBookPdfPath?: string;
  maxRequestsOverride?: number | null;
  donor?: BookDonorInfo;
  tags?: TagSummary[];
}
