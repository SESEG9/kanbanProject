import { Pipe, PipeTransform } from '@angular/core';
import { VacationApplyState, VacationApplyUser } from '../vacation.model';

@Pipe({
  name: 'overlappings',
})
export class OverlappingsPipe implements PipeTransform {
  transform(items: VacationApplyUser[], filter: { states: VacationApplyState[] }): VacationApplyUser[] {
    return items
      .filter(item => filter.states.includes(item.state))
      .sort((a, b) => this.stateToNumber(a.state) - this.stateToNumber(b.state));
  }

  private stateToNumber(state: VacationApplyState) {
    switch (state) {
      case 'APPROVED':
        return 1;
      case 'APPLIED':
        return 2;
      case 'REJECTED':
        return 3;
    }
  }
}
