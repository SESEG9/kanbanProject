import { IRoom } from 'app/entities/room/room.model';
import { DeficitState } from 'app/entities/enumerations/deficit-state.model';

export interface IDeficit {
  id: number;
  description?: string | null;
  state?: DeficitState | null;
  discount?: number | null;
  room?: Pick<IRoom, 'id'> | null;
}

export type NewDeficit = Omit<IDeficit, 'id'> & { id: null };
