import { IBulkLetterTemplate } from 'app/entities/bulk-letter-template/bulk-letter-template.model';

export interface IEmailAttachment {
  id: number;
  image?: string | null;
  imageContentType?: string | null;
  bulkLetterTemplate?: Pick<IBulkLetterTemplate, 'id'> | null;
}

export type NewEmailAttachment = Omit<IEmailAttachment, 'id'> & { id: null };
