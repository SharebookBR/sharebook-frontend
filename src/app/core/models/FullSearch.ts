import { FullSearchItem } from './FullSearchItem';

export class FullSearch {
  page: number;
  itemsPerPage: number;
  totalItems: number;
  items?: FullSearchItem[];
}
