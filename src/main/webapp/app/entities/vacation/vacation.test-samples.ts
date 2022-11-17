import dayjs from 'dayjs/esm';

import { VacationState } from 'app/entities/enumerations/vacation-state.model';

import { IVacation, NewVacation } from './vacation.model';

export const sampleWithRequiredData: IVacation = {
  id: 55228,
};

export const sampleWithPartialData: IVacation = {
  id: 40309,
  start: dayjs('2022-11-16'),
};

export const sampleWithFullData: IVacation = {
  id: 92489,
  start: dayjs('2022-11-16'),
  end: dayjs('2022-11-16'),
  state: VacationState['DECLINED'],
};

export const sampleWithNewData: NewVacation = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
