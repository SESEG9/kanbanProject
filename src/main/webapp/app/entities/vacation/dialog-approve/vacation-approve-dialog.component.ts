import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IVacation } from '../vacation.model';
import { VacationService } from '../service/vacation.service';
import { VACATION_APPROVED } from '../vacation.constants';

@Component({
  templateUrl: './vacation-approve-dialog.component.html',
  styleUrls: ['../vacation.dialog.component.scss'],
})
export class VacationApproveDialogComponent {
  vacation?: IVacation;

  constructor(protected vacationService: VacationService, protected activeModal: NgbActiveModal) {}

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
