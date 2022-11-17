import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { WorkPackageComponent } from '../list/work-package.component';
import { WorkPackageDetailComponent } from '../detail/work-package-detail.component';
import { WorkPackageUpdateComponent } from '../update/work-package-update.component';
import { WorkPackageRoutingResolveService } from './work-package-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const workPackageRoute: Routes = [
  {
    path: '',
    component: WorkPackageComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: WorkPackageDetailComponent,
    resolve: {
      workPackage: WorkPackageRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: WorkPackageUpdateComponent,
    resolve: {
      workPackage: WorkPackageRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: WorkPackageUpdateComponent,
    resolve: {
      workPackage: WorkPackageRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(workPackageRoute)],
  exports: [RouterModule],
})
export class WorkPackageRoutingModule {}
