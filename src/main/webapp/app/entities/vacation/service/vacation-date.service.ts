import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class VacationDateService {
  constructor() {}

  /**
   * Get the vacation days for a vacation between the two provided dates
   *
   * @param start The start date of the vacation
   * @param end The end date of the vacation
   * @return The number of days the vacation occupied
   */
  getVacationDays(start: Date, end: Date): number {
    return Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  }
}
