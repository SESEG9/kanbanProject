import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { BulkLetterTemplateComponent } from '../list/bulk-letter-template.component';
import { BulkLetterTemplateDetailComponent } from '../detail/bulk-letter-template-detail.component';
import { BulkLetterTemplateUpdateComponent } from '../update/bulk-letter-template-update.component';
import { BulkLetterTemplateRoutingResolveService } from './bulk-letter-template-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const bulkLetterTemplateRoute: Routes = [
  {
    path: '',
    component: BulkLetterTemplateComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: BulkLetterTemplateDetailComponent,
    resolve: {
      bulkLetterTemplate: BulkLetterTemplateRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: BulkLetterTemplateUpdateComponent,
    resolve: {
      bulkLetterTemplate: BulkLetterTemplateRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: BulkLetterTemplateUpdateComponent,
    resolve: {
      bulkLetterTemplate: BulkLetterTemplateRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(bulkLetterTemplateRoute)],
  exports: [RouterModule],
})
export class BulkLetterTemplateRoutingModule {}
