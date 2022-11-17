import dayjs from 'dayjs/esm';

import { IWorkPackage, NewWorkPackage } from './work-package.model';

export const sampleWithRequiredData: IWorkPackage = {
  id: 56503,
};

export const sampleWithPartialData: IWorkPackage = {
  id: 21962,
  end: dayjs('2022-11-16'),
  summary: 'SMS port',
};

export const sampleWithFullData: IWorkPackage = {
  id: 69204,
  start: dayjs('2022-11-17'),
  end: dayjs('2022-11-16'),
  summary: 'reboot 24/365',
  description: 'Fish Nordrhein-Westfalen Garden',
};

export const sampleWithNewData: NewWorkPackage = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
