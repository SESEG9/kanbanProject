import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { VacationService } from '../service/vacation.service';
import { VACATION_REJECTED } from '../vacation.constants';
import { VacationDateService } from '../service/vacation-date.service';
import { FixedVacation } from '../service/fixed-vacation.service';
import { VacationState } from '../../enumerations/vacation-state.model';

@Component({
  templateUrl: './vacation-reject-dialog.component.html',
  styleUrls: ['../vacation.dialog.component.scss'],
})
export class VacationRejectDialogComponent {
  vacation?: FixedVacation;

  constructor(
    protected vacationService: VacationService,
    protected activeModal: NgbActiveModal,
    public vacationDateService: VacationDateService
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    // TODO correct call to backend
    this.vacationService.update({ id: id, state: VacationState.DECLINED }).subscribe(() => {
      this.activeModal.close(VACATION_REJECTED);
    });
  }
}
