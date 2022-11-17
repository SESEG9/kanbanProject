import { IGlobalSettings, NewGlobalSettings } from './global-settings.model';

export const sampleWithRequiredData: IGlobalSettings = {
  id: 70972,
};

export const sampleWithPartialData: IGlobalSettings = {
  id: 1857,
  cancelTime: 61884,
};

export const sampleWithFullData: IGlobalSettings = {
  id: 26712,
  cancelTime: 74101,
};

export const sampleWithNewData: NewGlobalSettings = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
