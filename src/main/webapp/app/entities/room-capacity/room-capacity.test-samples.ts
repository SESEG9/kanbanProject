import { IRoomCapacity, NewRoomCapacity } from './room-capacity.model';

export const sampleWithRequiredData: IRoomCapacity = {
  id: 84532,
};

export const sampleWithPartialData: IRoomCapacity = {
  id: 60656,
  name: 'Fresh Coordinator architectures',
};

export const sampleWithFullData: IRoomCapacity = {
  id: 54685,
  name: 'Generic payment',
  capacity: 77143,
};

export const sampleWithNewData: NewRoomCapacity = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
