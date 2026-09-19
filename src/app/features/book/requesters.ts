import { BookRequestStatus } from './BookRequestStatus';

export class Requesters {
  userId: string;
  requesterNickName: string;
  location: string;
  totalBooksWon: number;
  totalBooksDonated: number;
  requestText: string;
  status: BookRequestStatus;
}
