import { MyDonation } from './MyDonation';
import { UserDonationsSummary } from './userDonationsSummary';

export class UserDonationsList {
  page: number;
  itemsPerPage: number;
  totalItems: number;
  summary: UserDonationsSummary;
  items?: MyDonation[];
}
