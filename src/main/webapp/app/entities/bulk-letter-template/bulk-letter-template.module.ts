import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { BulkLetterTemplateComponent } from './list/bulk-letter-template.component';
import { BulkLetterTemplateDetailComponent } from './detail/bulk-letter-template-detail.component';
import { BulkLetterTemplateUpdateComponent } from './update/bulk-letter-template-update.component';
import { BulkLetterTemplateDeleteDialogComponent } from './delete/bulk-letter-template-delete-dialog.component';
import { BulkLetterTemplateRoutingModule } from './route/bulk-letter-template-routing.module';

@NgModule({
  imports: [SharedModule, BulkLetterTemplateRoutingModule],
  declarations: [
    BulkLetterTemplateComponent,
    BulkLetterTemplateDetailComponent,
    BulkLetterTemplateUpdateComponent,
    BulkLetterTemplateDeleteDialogComponent,
  ],
})
export class BulkLetterTemplateModule {}
