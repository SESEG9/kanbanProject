import { DeficitState } from 'app/entities/enumerations/deficit-state.model';

import { IDeficit, NewDeficit } from './deficit.model';

export const sampleWithRequiredData: IDeficit = {
  id: 12172,
};

export const sampleWithPartialData: IDeficit = {
  id: 58390,
  state: DeficitState['DONE'],
};

export const sampleWithFullData: IDeficit = {
  id: 97754,
  description: 'SAS AGP',
  state: DeficitState['IN_PROCESS'],
  discount: 13835,
};

export const sampleWithNewData: NewDeficit = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
