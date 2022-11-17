import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { HumanResourceComponent } from '../list/human-resource.component';
import { HumanResourceDetailComponent } from '../detail/human-resource-detail.component';
import { HumanResourceUpdateComponent } from '../update/human-resource-update.component';
import { HumanResourceRoutingResolveService } from './human-resource-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const humanResourceRoute: Routes = [
  {
    path: '',
    component: HumanResourceComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: HumanResourceDetailComponent,
    resolve: {
      humanResource: HumanResourceRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: HumanResourceUpdateComponent,
    resolve: {
      humanResource: HumanResourceRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: HumanResourceUpdateComponent,
    resolve: {
      humanResource: HumanResourceRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(humanResourceRoute)],
  exports: [RouterModule],
})
export class HumanResourceRoutingModule {}
