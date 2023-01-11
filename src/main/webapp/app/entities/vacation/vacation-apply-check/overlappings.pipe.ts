import { Pipe, PipeTransform } from '@angular/core';
import { VacationState } from '../../enumerations/vacation-state.model';
import { FixedVacation } from '../service/fixed-vacation.service';

@Pipe({
  name: 'overlappings',
})
export class OverlappingsPipe implements PipeTransform {
  transform(items: FixedVacation[], filter: { states: VacationState[]; thisVacationId?: number | null }): FixedVacation[] {
    return items
      .filter(item => item.state && filter.states.includes(item.state))
      .filter(item => item.id !== filter.thisVacationId)
      .sort((a, b) => OverlappingsPipe.stateToNumber(a.state) - OverlappingsPipe.stateToNumber(b.state));
  }

  private static stateToNumber(state?: VacationState | null): number {
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
