import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { VacationComponent } from '../list/vacation.component';
import { VacationDetailComponent } from '../detail/vacation-detail.component';
import { VacationUpdateComponent } from '../update/vacation-update.component';
import { VacationRoutingResolveService } from './vacation-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';
import { VacationApplyCreateComponent } from '../vacation-apply-create/vacation-apply-create.component';
import { VacationApplyCheckComponent } from '../vacation-apply-check/vacation-apply-check.component';

const vacationRoute: Routes = [
  {
    path: '',
    component: VacationComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: VacationDetailComponent,
    resolve: {
      vacation: VacationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: VacationUpdateComponent,
    resolve: {
      vacation: VacationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: VacationUpdateComponent,
    resolve: {
      vacation: VacationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'apply',
    component: VacationApplyCreateComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'check/:id', // TODO introduce ID
    component: VacationApplyCheckComponent,
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(vacationRoute)],
  exports: [RouterModule],
})
export class VacationRoutingModule {}
