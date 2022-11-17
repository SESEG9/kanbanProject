import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IWorkPackage } from '../work-package.model';
import { WorkPackageService } from '../service/work-package.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './work-package-delete-dialog.component.html',
})
export class WorkPackageDeleteDialogComponent {
  workPackage?: IWorkPackage;

  constructor(protected workPackageService: WorkPackageService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.workPackageService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
