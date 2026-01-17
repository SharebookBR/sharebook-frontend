import { Category } from './category';
import { BookDonationStatus } from './BookDonationStatus';

export type BookType = 'Printed' | 'Eletronic';

export class Book {
  title: string;
  author: string;
  slug: string;
  imageBytes: string;
  imageSlug: string;
  freightOption: string;
  userId: string;
  categoryId: string;
  userIdFacilitator: string;
  category: Category;
  imageUrl: string;
  imageName: string;
  chooseDate: Date;
  synopsis: string;
  id: string;
  creationDate: Date;
  status: BookDonationStatus;
  city: string;
  state: string;
  type: BookType;
  pdfBytes?: string;
  eBookPdfPath?: string;
}
