import { Pipe, PipeTransform } from '@angular/core';
import { VacationState } from '../../enumerations/vacation-state.model';
import { FixedVacation } from '../service/fixed-vacation.service';

@Pipe({
  name: 'vacationStatePipe',
})
export class VacationStatePipePipe implements PipeTransform {
  transform(items: FixedVacation[], state: VacationState): FixedVacation[] {
    return items.filter(item => item.state === state).sort((a, b) => a.start.toDate().getTime() - b.start.toDate().getTime());
  }
}
