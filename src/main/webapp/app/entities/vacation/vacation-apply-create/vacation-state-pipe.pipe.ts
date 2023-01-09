import { Pipe, PipeTransform } from '@angular/core';
import { IVacation } from '../vacation.model';
import { VacationState } from '../../enumerations/vacation-state.model';

@Pipe({
  name: 'vacationStatePipe',
})
export class VacationStatePipePipe implements PipeTransform {
  transform(items: IVacation[], state: VacationState): IVacation[] {
    return items.filter(item => item.state === state).sort((a, b) => a.start!!.getTime() - b.start!!.getTime());
  }
}
