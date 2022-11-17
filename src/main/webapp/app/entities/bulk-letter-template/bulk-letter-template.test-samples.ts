import dayjs from 'dayjs/esm';

import { BulkLetterType } from 'app/entities/enumerations/bulk-letter-type.model';

import { IBulkLetterTemplate, NewBulkLetterTemplate } from './bulk-letter-template.model';

export const sampleWithRequiredData: IBulkLetterTemplate = {
  id: 93479,
};

export const sampleWithPartialData: IBulkLetterTemplate = {
  id: 13757,
  date: dayjs('2022-11-17'),
  subject: 'Intranet',
};

export const sampleWithFullData: IBulkLetterTemplate = {
  id: 40876,
  type: BulkLetterType['BIRTHDAY'],
  date: dayjs('2022-11-17'),
  subject: 'olive Bike',
  content: '../fake-data/blob/hipster.txt',
};

export const sampleWithNewData: NewBulkLetterTemplate = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
