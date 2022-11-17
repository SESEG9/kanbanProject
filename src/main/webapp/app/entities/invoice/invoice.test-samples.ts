import dayjs from 'dayjs/esm';

import { IInvoice, NewInvoice } from './invoice.model';

export const sampleWithRequiredData: IInvoice = {
  id: 91509,
};

export const sampleWithPartialData: IInvoice = {
  id: 18841,
  hotelAddress: 'Berkshire Guyana',
  customerAddress: 'Emirate Bayern auxiliary',
};

export const sampleWithFullData: IInvoice = {
  id: 55119,
  hotelAddress: 'empower Buckinghamshire Berlin',
  customerAddress: 'Rubber',
  discount: 75162,
  price: 35861,
  duration: 91014,
  billingDate: dayjs('2022-11-16'),
  cancled: true,
};

export const sampleWithNewData: NewInvoice = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
