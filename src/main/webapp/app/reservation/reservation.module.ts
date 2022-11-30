import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReservationComponent } from './reservation.component';
import { NewReservationComponent } from 'app/reservation/new-reservation/new-reservation.component';
import { SharedModule } from 'app/shared/shared.module';



@NgModule({
  declarations: [
    ReservationComponent,
    NewReservationComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild([
      {
        path: ':id',
        component: NewReservationComponent
      },
      {
        path: '',
        component: ReservationComponent
      }
    ])
  ]
})
export class ReservationModule { }
