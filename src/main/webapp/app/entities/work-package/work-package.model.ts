import dayjs from 'dayjs/esm';
import { IHumanResource } from 'app/entities/human-resource/human-resource.model';

export interface IWorkPackage {
  id: number;
  start?: dayjs.Dayjs | null;
  end?: dayjs.Dayjs | null;
  summary?: string | null;
  description?: string | null;
  humanResource?: Pick<IHumanResource, 'id'> | null;
}

export type NewWorkPackage = Omit<IWorkPackage, 'id'> & { id: null };
