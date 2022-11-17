export interface IRoomCapacity {
  id: number;
  name?: string | null;
  capacity?: number | null;
}

export type NewRoomCapacity = Omit<IRoomCapacity, 'id'> & { id: null };
