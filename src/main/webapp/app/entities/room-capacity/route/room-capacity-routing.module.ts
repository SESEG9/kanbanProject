import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { RoomCapacityComponent } from '../list/room-capacity.component';
import { RoomCapacityDetailComponent } from '../detail/room-capacity-detail.component';
import { RoomCapacityUpdateComponent } from '../update/room-capacity-update.component';
import { RoomCapacityRoutingResolveService } from './room-capacity-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const roomCapacityRoute: Routes = [
  {
    path: '',
    component: RoomCapacityComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: RoomCapacityDetailComponent,
    resolve: {
      roomCapacity: RoomCapacityRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: RoomCapacityUpdateComponent,
    resolve: {
      roomCapacity: RoomCapacityRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: RoomCapacityUpdateComponent,
    resolve: {
      roomCapacity: RoomCapacityRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(roomCapacityRoute)],
  exports: [RouterModule],
})
export class RoomCapacityRoutingModule {}
