import { Category } from './category';
import { User } from './user';
import { BookDonationStatus } from './BookDonationStatus';

export class Book {
  title: string;
  author: string;
  slug: string;
  imageBytes: string;
  imageSlug: string;
  freightOption: string;
  userId: string;
  categoryId: string;
  user: User;
  userIdFacilitator: string;
  userFacilitator: User;
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
}
