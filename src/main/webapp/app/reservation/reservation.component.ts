import { Component } from '@angular/core';
import { rooms } from 'app/app.constants';

interface Reservation {
  firstName: string;
  lastName: string;
  email: string;
  tel: string;
  birthdate: string;
  gender: string;
  reservationStart: string;
  reservationEnd: string;
  room: number;
  price: string;
  cancelled: boolean;
}

@Component({
  selector: 'jhi-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.scss'],
})
export class ReservationComponent {
  reservation?: Reservation;

  success = false;
  error = false;

  reservationNumber = '';

  loadReservation(): void {
    this.reservation = {
      firstName: 'Max',
      lastName: 'Mustermann',
      email: 'mail@mailster.com',
      tel: '0800 666666',
      birthdate: '20.4.1969',
      gender: 'd',
      reservationStart: '1.12.2022',
      reservationEnd: '13.12.2022',
      room: 1,
      price: '655€',
      cancelled: false,
    };
  }

  getRoomById(id: number): string {
    // eslint-disable-next-line eqeqeq
    return rooms.filter((room: any) => room.id == id)[0].title;
  }
  getGender(gender: string): string {
    switch (gender) {
      case 'm':
        return 'Männlich';
      case 'w':
        return 'Weiblich';
      case 'd':
        return 'Divers';
      default:
        return '';
    }
  }

  cancelReservation(): void {
    this.reservation = undefined;
    this.success = true;
  }
}
