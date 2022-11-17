import { IEmailAttachment, NewEmailAttachment } from './email-attachment.model';

export const sampleWithRequiredData: IEmailAttachment = {
  id: 99987,
};

export const sampleWithPartialData: IEmailAttachment = {
  id: 3956,
  image: '../fake-data/blob/hipster.png',
  imageContentType: 'unknown',
};

export const sampleWithFullData: IEmailAttachment = {
  id: 40438,
  image: '../fake-data/blob/hipster.png',
  imageContentType: 'unknown',
};

export const sampleWithNewData: NewEmailAttachment = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
