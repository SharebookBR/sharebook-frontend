export class MyRequest {
  page: number;
  itemsPerPage: number;
  totalItems: number;
  items?: [
    {
      requestId?: string;
      title?: string;
      author?: string;
      status?: string;
      statusCode: string;
      bookStatus?: string;
      trackingNumber?: string;
      bookId?: string;
      slug?: string;
    }
  ];

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
