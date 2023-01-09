import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { VacationComponent } from '../list/vacation.component';
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
