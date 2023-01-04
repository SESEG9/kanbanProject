import { Pipe, PipeTransform } from '@angular/core';
import { VacationApply, VacationApplyState } from '../vacation.model';

@Pipe({
  name: 'vacationStatePipe',
})
export class VacationStatePipePipe implements PipeTransform {
  transform(items: VacationApply[], state: VacationApplyState): VacationApply[] {
    return items.filter(item => item.state === state).sort((a, b) => a.from.getTime() - b.from.getTime());
  }
}
