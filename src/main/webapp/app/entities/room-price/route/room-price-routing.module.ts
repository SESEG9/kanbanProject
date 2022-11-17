import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { RoomPriceComponent } from '../list/room-price.component';
import { RoomPriceDetailComponent } from '../detail/room-price-detail.component';
import { RoomPriceUpdateComponent } from '../update/room-price-update.component';
import { RoomPriceRoutingResolveService } from './room-price-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const roomPriceRoute: Routes = [
  {
    path: '',
    component: RoomPriceComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: RoomPriceDetailComponent,
    resolve: {
      roomPrice: RoomPriceRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: RoomPriceUpdateComponent,
    resolve: {
      roomPrice: RoomPriceRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: RoomPriceUpdateComponent,
    resolve: {
      roomPrice: RoomPriceRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(roomPriceRoute)],
  exports: [RouterModule],
})
export class RoomPriceRoutingModule {}
