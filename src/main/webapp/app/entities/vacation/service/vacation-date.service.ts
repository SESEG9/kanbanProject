import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class VacationDateService {
  /**
   * Get the vacation days for a vacation between the two provided dates
   *
   * @param start The start date of the vacation
   * @param end The end date of the vacation
   * @return The number of days the vacation occupied
   */
  getVacationDays(start?: Date | null, end?: Date | null): number {
    if (!start || !end) {
      return 0;
    }
    return Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  }

  getRemainingDaysForStartYear(start: Date, end: Date, remaining: number): number {
    const startYear = start.getFullYear();
    const endDate = end.getFullYear() === startYear ? end : new Date(Date.UTC(startYear, 11, 31));

    return remaining - this.getVacationDays(start, endDate);
  }

  getRemainingDaysForEndYear(end: Date, remaining: number): number {
    const start = new Date(Date.UTC(end.getFullYear(), 0, 1));
    return remaining - this.getVacationDays(start, end);
  }
}
