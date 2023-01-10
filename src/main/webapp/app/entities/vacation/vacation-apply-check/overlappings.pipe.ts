import { Pipe, PipeTransform } from '@angular/core';
import { IVacation } from '../vacation.model';
import { VacationState } from '../../enumerations/vacation-state.model';

@Pipe({
  name: 'overlappings',
})
export class OverlappingsPipe implements PipeTransform {
  transform(items: IVacation[], filter: { states: VacationState[] }): IVacation[] {
    return items
      .filter(item => item.state && filter.states.includes(item.state))
      .sort((a, b) => this.stateToNumber(a.state) - this.stateToNumber(b.state));
  }

  private stateToNumber(state?: VacationState | null) {
    switch (state) {
      case VacationState.ACCEPTED:
        return 1;
      case VacationState.REQUESTED:
        return 2;
      case null:
      case undefined:
      case VacationState.DECLINED:
        return 3;
    }
  }
}
