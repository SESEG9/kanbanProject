import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IHumanResource } from '../human-resource.model';
import { HumanResourceService } from '../service/human-resource.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './human-resource-delete-dialog.component.html',
})
export class HumanResourceDeleteDialogComponent {
  humanResource?: IHumanResource;

  constructor(protected humanResourceService: HumanResourceService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.humanResourceService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
