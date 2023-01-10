import { Pipe, PipeTransform } from '@angular/core';
import { VacationState } from '../../enumerations/vacation-state.model';
import { FixedVacation } from '../service/fixed-vacation.service';

@Pipe({
  name: 'overlappings',
})
export class OverlappingsPipe implements PipeTransform {
  transform(items: FixedVacation[], filter: { states: VacationState[] }): FixedVacation[] {
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
