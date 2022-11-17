import dayjs from 'dayjs/esm';

import { IBooking, NewBooking } from './booking.model';

export const sampleWithRequiredData: IBooking = {
  id: 79364,
};

export const sampleWithPartialData: IBooking = {
  id: 76639,
  discount: 32309,
  startDate: dayjs('2022-11-16'),
  duration: 23465,
};

export const sampleWithFullData: IBooking = {
  id: 56506,
  discount: 26667,
  price: 68861,
  startDate: dayjs('2022-11-17'),
  duration: 34097,
  cancled: false,
};

export const sampleWithNewData: NewBooking = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
