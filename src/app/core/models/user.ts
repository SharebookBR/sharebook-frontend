import { Profile } from './profile';
import { Address } from './address';

export class User {
  id: string;
  name: string;
  email?: string;
  password?: string;
  passwordSalt?: string;
  hashCodePassword?: string;
  hashCodePasswordExpiryDate?: Date;
  linkedin?: string;
  phone?: string;
  profile?: Profile;
  address?: Address;
  creationDate?: Date;
  allowSendingEmail?: boolean;
}
