import dayjs from 'dayjs/esm';

import { HumanResourceType } from 'app/entities/enumerations/human-resource-type.model';
import { Gender } from 'app/entities/enumerations/gender.model';

import { IHumanResource, NewHumanResource } from './human-resource.model';

export const sampleWithRequiredData: IHumanResource = {
  id: 60479,
  abbr: 'Cotton generation',
  name: 'mint Soft',
  birthday: dayjs('2022-11-16'),
  gender: Gender['MALE'],
};

export const sampleWithPartialData: IHumanResource = {
  id: 58189,
  abbr: 'Marks Serbian bandwidth',
  name: 'online Togo',
  birthday: dayjs('2022-11-17'),
  gender: Gender['DIVERSE'],
  phone: '(05878) 1836596',
  bannking: 'bandwidth up compressing',
};

export const sampleWithFullData: IHumanResource = {
  id: 22937,
  type: HumanResourceType['KITCHEN'],
  abbr: 'SDD',
  name: 'Shoes Refined und',
  birthday: dayjs('2022-11-16'),
  gender: Gender['DIVERSE'],
  phone: '+49-637-0297595',
  email: 'Elias.Priemer@gmail.com',
  ssn: 'Mission payment',
  bannking: 'Rest Berkshire',
  relationshipType: 'Buckinghamshire',
};

export const sampleWithNewData: NewHumanResource = {
  abbr: 'Checking',
  name: 'Coordinator',
  birthday: dayjs('2022-11-16'),
  gender: Gender['FEMALE'],
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
