import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IBulkLetterTemplate } from '../bulk-letter-template.model';
import { BulkLetterTemplateService } from '../service/bulk-letter-template.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './bulk-letter-template-delete-dialog.component.html',
})
export class BulkLetterTemplateDeleteDialogComponent {
  bulkLetterTemplate?: IBulkLetterTemplate;

  constructor(protected bulkLetterTemplateService: BulkLetterTemplateService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.bulkLetterTemplateService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
