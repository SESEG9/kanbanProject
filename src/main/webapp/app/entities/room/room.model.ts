import { IInvoice } from 'app/entities/invoice/invoice.model';
import { IBooking } from 'app/entities/booking/booking.model';
import { IRoomCapacity } from '../room-capacity/room-capacity.model';

export interface IRoom {
  id: number;
  identifyer?: string | null;
  maxCapacity?: number | null;
  invoice?: Pick<IInvoice, 'id'> | null;
  bookings?: Pick<IBooking, 'id'>[] | null;
}

export type NewRoom = Omit<IRoom, 'id'> & { id: null };

export interface RoomPrice {
  id: number | null;
  price: number;
  capacity: IRoomCapacity | undefined;
}

export interface RoomPicture {
  id: number | null;
  image: string;
  weight: number;
  description: string;
}

export interface Room {
  id: number | null;
  identifyer?: string | null;
  maxCapacity?: number | null;
  prices: RoomPrice[];
  roomPictures: RoomPicture[];
}

export interface RoomResponse {
  id: number | null;
  identifyer?: string | null;
  maxCapacity?: number | null;
  prices: RoomPrice[];
  roomPictures: number[];
}
