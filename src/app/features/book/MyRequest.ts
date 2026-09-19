import { MyRequestItem } from './MyRequestItem';

export class MyRequest {
  page: number;
  itemsPerPage: number;
  totalItems: number;
  items?: MyRequestItem[];

  constructor(myRequest?: MyRequest) {
    this.page = 0;
    this.itemsPerPage = 0;
    this.totalItems = 0;
    this.items = [{
      requestId: '',
      title: '',
      author: '',
      status: '',
      statusCode: '',
      bookStatus: '',
      trackingNumber: '',
      bookId: '',
      slug: ''
    }];
  }
}
