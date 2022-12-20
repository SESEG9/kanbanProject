import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { DiscountListComponent } from '../list/discount-list.component';
import { ASC } from 'app/config/navigation.constants';
import { DiscountUpdateComponent } from '../update/discount-update.component';

const deficitRoute: Routes = [
  {
    path: '',
    component: DiscountListComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: DiscountUpdateComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(deficitRoute)],
  exports: [RouterModule],
})
export class DiscountRoutingModule {}
