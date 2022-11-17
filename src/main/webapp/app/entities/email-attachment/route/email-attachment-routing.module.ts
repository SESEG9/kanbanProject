import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { EmailAttachmentComponent } from '../list/email-attachment.component';
import { EmailAttachmentDetailComponent } from '../detail/email-attachment-detail.component';
import { EmailAttachmentUpdateComponent } from '../update/email-attachment-update.component';
import { EmailAttachmentRoutingResolveService } from './email-attachment-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const emailAttachmentRoute: Routes = [
  {
    path: '',
    component: EmailAttachmentComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: EmailAttachmentDetailComponent,
    resolve: {
      emailAttachment: EmailAttachmentRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: EmailAttachmentUpdateComponent,
    resolve: {
      emailAttachment: EmailAttachmentRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: EmailAttachmentUpdateComponent,
    resolve: {
      emailAttachment: EmailAttachmentRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(emailAttachmentRoute)],
  exports: [RouterModule],
})
export class EmailAttachmentRoutingModule {}
