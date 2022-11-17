import { IRoom, NewRoom } from './room.model';

export const sampleWithRequiredData: IRoom = {
  id: 302,
};

export const sampleWithPartialData: IRoom = {
  id: 70708,
  identifyer: 'RSS',
};

export const sampleWithFullData: IRoom = {
  id: 3705,
  identifyer: 'bandwidth-monitored Account',
  maxCapacity: 91197,
};

export const sampleWithNewData: NewRoom = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
