import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { VacationApplyUser } from '../vacation.model';
import { VacationService } from '../service/vacation.service';
import { VACATION_APPROVED } from '../vacation.constants';
import { VacationDateService } from '../service/vacation-date.service';
import * as FontAwesome from '@fortawesome/free-solid-svg-icons';

@Component({
  templateUrl: './vacation-approve-dialog.component.html',
  styleUrls: ['../vacation.dialog.component.scss'],
})
export class VacationApproveDialogComponent {
  vacation?: VacationApplyUser;
  ICONS = FontAwesome;

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
    this.vacationService.delete(id).subscribe(() => {
      this.activeModal.close(VACATION_APPROVED);
    });
  }
}
