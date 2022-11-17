import dayjs from 'dayjs/esm';

import { Gender } from 'app/entities/enumerations/gender.model';

import { ICustomer, NewCustomer } from './customer.model';

export const sampleWithRequiredData: ICustomer = {
  id: 24379,
  name: 'Operations',
  birthday: dayjs('2022-11-17'),
  gender: Gender['DIVERSE'],
  billingAddress: 'ADP scalable',
  telephone: '+49-569-5853006',
  email: 'Rebekka43@hotmail.com',
};

export const sampleWithPartialData: ICustomer = {
  id: 30781,
  name: 'calculate front-end Towels',
  birthday: dayjs('2022-11-16'),
  gender: Gender['MALE'],
  billingAddress: 'Euro Rheinland-Pfalz',
  companyName: 'Hamburg',
  note: 'silver transmitter',
  discount: 12760,
  telephone: '(0305) 017953767',
  email: 'Bennet_Seeger60@hotmail.com',
  web: 'deposit Home back-end',
};

export const sampleWithFullData: ICustomer = {
  id: 54351,
  name: 'Fish',
  birthday: dayjs('2022-11-16'),
  gender: Gender['MALE'],
  billingAddress: 'Oval',
  companyName: 'Cotton',
  note: 'Wooden',
  discount: 76116,
  telephone: '+49-913-3642065',
  email: 'Danny80@hotmail.com',
  web: 'Tasty primary Dollar',
  fax: 'channels Slowenien',
};

export const sampleWithNewData: NewCustomer = {
  name: 'instruction Intelligent transmitter',
  birthday: dayjs('2022-11-16'),
  gender: Gender['FEMALE'],
  billingAddress: 'gold Brand paradigms',
  telephone: '(02517) 0016877',
  email: 'Miray_Hohenberger@hotmail.com',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
