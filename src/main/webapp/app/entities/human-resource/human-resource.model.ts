import dayjs from 'dayjs/esm';
import { HumanResourceType } from 'app/entities/enumerations/human-resource-type.model';
import { Gender } from 'app/entities/enumerations/gender.model';

export interface IHumanResource {
  id: number;
  type?: HumanResourceType | null;
  abbr?: string | null;
  name?: string | null;
  birthday?: dayjs.Dayjs | null;
  gender?: Gender | null;
  phone?: string | null;
  email?: string | null;
  ssn?: string | null;
  bannking?: string | null;
  relationshipType?: string | null;
}

export type NewHumanResource = Omit<IHumanResource, 'id'> & { id: null };
