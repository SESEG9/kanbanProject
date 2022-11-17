import { IRoomPrice, NewRoomPrice } from './room-price.model';

export const sampleWithRequiredData: IRoomPrice = {
  id: 76159,
};

export const sampleWithPartialData: IRoomPrice = {
  id: 31911,
  price: 66266,
};

export const sampleWithFullData: IRoomPrice = {
  id: 72826,
  price: 39385,
};

export const sampleWithNewData: NewRoomPrice = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
