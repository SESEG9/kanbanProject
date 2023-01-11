import { Injectable } from '@angular/core';
import { IVacation } from '../vacation.model';
import dayjs from 'dayjs';

export type FixedVacation = Omit<IVacation, 'start' | 'end'> & { start: dayjs.Dayjs; end: dayjs.Dayjs };

@Injectable({
  providedIn: 'root',
})
export class FixedVacationService {
  vacationsToFixedVacations(vacations: IVacation[]): FixedVacation[] {
    return vacations
      .map(vacation => this.vacationToFixedVacation(vacation))
      .filter(fixedVacation => fixedVacation != null)
      .map(fixedVacation => fixedVacation!!);
  }

  vacationToFixedVacation(vacation: IVacation): FixedVacation | null {
    const start = vacation.start;
    const end = vacation.end;

    return start != null && end != null ? { ...vacation, start, end } : null;
  }
}
