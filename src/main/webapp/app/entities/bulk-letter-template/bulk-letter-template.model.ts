import dayjs from 'dayjs/esm';
import { BulkLetterType } from 'app/entities/enumerations/bulk-letter-type.model';

export interface IBulkLetterTemplate {
  id: number;
  type?: BulkLetterType | null;
  date?: dayjs.Dayjs | null;
  subject?: string | null;
  content?: string | null;
}

export type NewBulkLetterTemplate = Omit<IBulkLetterTemplate, 'id'> & { id: null };
