import { VacationState } from 'app/entities/enumerations/vacation-state.model';
import { IUser } from '../user/user.model';

export interface IVacation {
  id: number;
  start?: Date | null;
  end?: Date | null;
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
