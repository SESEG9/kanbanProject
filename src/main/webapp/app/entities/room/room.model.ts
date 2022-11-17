import { IInvoice } from 'app/entities/invoice/invoice.model';
import { IBooking } from 'app/entities/booking/booking.model';

export interface IRoom {
  id: number;
  identifyer?: string | null;
  maxCapacity?: number | null;
  invoice?: Pick<IInvoice, 'id'> | null;
  bookings?: Pick<IBooking, 'id'>[] | null;
}

export type NewRoom = Omit<IRoom, 'id'> & { id: null };
