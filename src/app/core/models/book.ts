import { FreightOptions } from './freightOptions';

export class Book {
  id: string;
  userId: number;
  title: string;
  author: string;
  imageBytes: any[];
  imageUrl: string;
  approved: true;
  categoryId: number;
  freightOption: string;
}
