import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { GlobalSettingsComponent } from '../list/global-settings.component';
import { GlobalSettingsDetailComponent } from '../detail/global-settings-detail.component';
import { GlobalSettingsUpdateComponent } from '../update/global-settings-update.component';
import { GlobalSettingsRoutingResolveService } from './global-settings-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const globalSettingsRoute: Routes = [
  {
    path: '',
    component: GlobalSettingsComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: GlobalSettingsDetailComponent,
    resolve: {
      globalSettings: GlobalSettingsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: GlobalSettingsUpdateComponent,
    resolve: {
      globalSettings: GlobalSettingsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: GlobalSettingsUpdateComponent,
    resolve: {
      globalSettings: GlobalSettingsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(globalSettingsRoute)],
  exports: [RouterModule],
})
export class GlobalSettingsRoutingModule {}
