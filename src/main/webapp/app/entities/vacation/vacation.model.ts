import dayjs from 'dayjs/esm';
import { IHumanResource } from 'app/entities/human-resource/human-resource.model';
import { VacationState } from 'app/entities/enumerations/vacation-state.model';

export interface IVacation {
  id: number;
  start?: dayjs.Dayjs | null;
  end?: dayjs.Dayjs | null;
  state?: VacationState | null;
  humanResource?: Pick<IHumanResource, 'id'> | null;
}

export type NewVacation = Omit<IVacation, 'id'> & { id: null };

export interface VacationApply {
  from: Date;
  to: Date;
  state: VacationApplyState;
}

export type VacationApplyState = 'APPROVED' | 'REJECTED' | 'APPLIED';
