import dayjs from 'dayjs/esm';
import { IBooking } from 'app/entities/booking/booking.model';
import { Gender } from 'app/entities/enumerations/gender.model';

export interface ICustomer {
  id: number;
  name?: string | null;
  birthday?: dayjs.Dayjs | null;
  gender?: Gender | null;
  billingAddress?: string | null;
  companyName?: string | null;
  note?: string | null;
  discount?: number | null;
  telephone?: string | null;
  email?: string | null;
  web?: string | null;
  fax?: string | null;
  bookings?: Pick<IBooking, 'id'>[] | null;
}

export type NewCustomer = Omit<ICustomer, 'id'> & { id: null };
