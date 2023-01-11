import { VacationState } from 'app/entities/enumerations/vacation-state.model';
import { IUser } from '../user/user.model';
import dayjs from 'dayjs';

export interface IVacation {
  id: number;
  start?: dayjs.Dayjs | null;
  end?: dayjs.Dayjs | null;
  state?: VacationState | null;
  user?: IUser | null;
}

export type NewVacation = Omit<IVacation, 'id'> & { id: null };

export interface VacationApply {
  start: Date;
  end: Date;
  state: VacationApplyState;
}

export type TmpUser = {
  firstName: string;
  lastName: string;
  area: string;
  freeVacation: number;
};

export type VacationApplyUser = VacationApply & { user: TmpUser } & { id: number };

export type VacationApplyState = 'APPROVED' | 'REJECTED' | 'APPLIED';
