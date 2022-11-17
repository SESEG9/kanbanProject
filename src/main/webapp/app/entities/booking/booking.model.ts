import dayjs from 'dayjs/esm';
import { ICustomer } from 'app/entities/customer/customer.model';
import { IRoom } from 'app/entities/room/room.model';

export interface IBooking {
  id: number;
  discount?: number | null;
  price?: number | null;
  startDate?: dayjs.Dayjs | null;
  duration?: number | null;
  cancled?: boolean | null;
  customers?: Pick<ICustomer, 'id'>[] | null;
  rooms?: Pick<IRoom, 'id'>[] | null;
}

export type NewBooking = Omit<IBooking, 'id'> & { id: null };
