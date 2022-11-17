import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IGlobalSettings } from '../global-settings.model';
import { GlobalSettingsService } from '../service/global-settings.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './global-settings-delete-dialog.component.html',
})
export class GlobalSettingsDeleteDialogComponent {
  globalSettings?: IGlobalSettings;

  constructor(protected globalSettingsService: GlobalSettingsService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.globalSettingsService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
