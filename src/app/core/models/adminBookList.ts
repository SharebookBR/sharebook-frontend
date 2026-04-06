import { AdminBookSummary } from './adminBookSummary';
import { BookVMItem } from './bookVMItem';

export class AdminBookList {
  page: number;
  itemsPerPage: number;
  totalItems: number;
  summary: AdminBookSummary;
  items?: BookVMItem[];
}
