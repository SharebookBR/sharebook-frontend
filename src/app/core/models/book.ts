import { Category } from './category';
import { User } from './user';

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
  approved: boolean;
  // bookUsers
  imageUrl: string;
  imageName: string;
  chooseDate: Date;
  synopsis: string;
  id: string;
  creationDate: Date;
}
