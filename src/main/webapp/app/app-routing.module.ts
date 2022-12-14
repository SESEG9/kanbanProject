import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { errorRoute } from './layouts/error/error.route';
import { navbarRoute } from './layouts/navbar/navbar.route';
import { DEBUG_INFO_ENABLED } from 'app/app.constants';
import { Authority } from 'app/config/authority.constants';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

@NgModule({
  imports: [
    RouterModule.forRoot(
      [
        {
          path: 'admin',
          data: {
            authorities: [Authority.ADMIN],
          },
          canActivate: [UserRouteAccessService],
          loadChildren: () => import('./admin/admin-routing.module').then(m => m.AdminRoutingModule),
        },
        {
          path: 'account',
          loadChildren: () => import('./account/account.module').then(m => m.AccountModule),
        },
        {
          path: 'login',
          loadChildren: () => import('./login/login.module').then(m => m.LoginModule),
        },
        {
          path: '',
          loadChildren: () => import(`./entities/entity-routing.module`).then(m => m.EntityRoutingModule),
        },
        {
          path: 'room',
          loadChildren: () => import(`./entities/room/room.module`).then(m => m.RoomModule),
        },
        {
          path: 'reservation',
          loadChildren: () => import('./reservation/reservation.module').then(m => m.ReservationModule),
        },
        {
          path: 'promotion',
          loadChildren: () => import('./promotion/promotion.module').then(m => m.PromotionModule),
        },
        {
          path: 'work-scheduling',
          loadChildren: () => import('./work-scheduling/work-scheduling.module').then(m => m.WorkSchedulingModule),
        },
        {
          path: 'contact',
          loadChildren: () => import('./contact/contact.module').then(m => m.ContactModule),
        },
        navbarRoute,
        ...errorRoute,
      ],
      { enableTracing: DEBUG_INFO_ENABLED }
    ),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
