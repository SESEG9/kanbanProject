import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { RoomComponent } from '../list/room.component';
import { RoomDetailComponent } from '../detail/room-detail.component';
import { RoomUpdateComponent } from '../update/room-update.component';
import { RoomRoutingResolveService } from './room-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const roomRoute: Routes = [
  {
    path: '',
    component: RoomComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: RoomDetailComponent,
    resolve: {
      room: RoomRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: RoomUpdateComponent,
    resolve: {
      room: RoomRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: RoomUpdateComponent,
    resolve: {
      room: RoomRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(roomRoute)],
  exports: [RouterModule],
})
export class RoomRoutingModule {}
