import { IRoomCapacity } from 'app/entities/room-capacity/room-capacity.model';
import { IRoom } from 'app/entities/room/room.model';

export interface IRoomPrice {
  id: number;
  price?: number | null;
  capacity?: Pick<IRoomCapacity, 'id'> | null;
  room?: Pick<IRoom, 'id'> | null;
}

export type NewRoomPrice = Omit<IRoomPrice, 'id'> & { id: null };
