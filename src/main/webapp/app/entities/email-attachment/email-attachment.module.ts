import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { EmailAttachmentComponent } from './list/email-attachment.component';
import { EmailAttachmentDetailComponent } from './detail/email-attachment-detail.component';
import { EmailAttachmentUpdateComponent } from './update/email-attachment-update.component';
import { EmailAttachmentDeleteDialogComponent } from './delete/email-attachment-delete-dialog.component';
import { EmailAttachmentRoutingModule } from './route/email-attachment-routing.module';

@NgModule({
  imports: [SharedModule, EmailAttachmentRoutingModule],
  declarations: [
    EmailAttachmentComponent,
    EmailAttachmentDetailComponent,
    EmailAttachmentUpdateComponent,
    EmailAttachmentDeleteDialogComponent,
  ],
})
export class EmailAttachmentModule {}
