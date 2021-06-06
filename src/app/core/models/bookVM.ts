import { BookVMItem } from './bookVMItem';

export class BookVM {
  page: number;
  itemsPerPage: number;
  totalItems: number;
  items?: BookVMItem[];
}
