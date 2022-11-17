import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { DeficitComponent } from '../list/deficit.component';
import { DeficitDetailComponent } from '../detail/deficit-detail.component';
import { DeficitUpdateComponent } from '../update/deficit-update.component';
import { DeficitRoutingResolveService } from './deficit-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const deficitRoute: Routes = [
  {
    path: '',
    component: DeficitComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: DeficitDetailComponent,
    resolve: {
      deficit: DeficitRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: DeficitUpdateComponent,
    resolve: {
      deficit: DeficitRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: DeficitUpdateComponent,
    resolve: {
      deficit: DeficitRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(deficitRoute)],
  exports: [RouterModule],
})
export class DeficitRoutingModule {}
