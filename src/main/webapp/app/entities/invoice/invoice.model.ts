import dayjs from 'dayjs/esm';
import { IBooking } from '../booking/booking.model';

export interface IInvoice {
  id: number;
  hotelAddress?: string | null;
  customerAddress?: string | null;
  discount?: number | null;
  price?: number | null;
  duration?: number | null;
  billingDate?: dayjs.Dayjs | null;
  cancled?: boolean | null;
  booking?: Pick<IBooking, 'id'> | null;
  bookingId?: number | null;
}

export type NewInvoice = Omit<IInvoice, 'id'> & { id: null };
