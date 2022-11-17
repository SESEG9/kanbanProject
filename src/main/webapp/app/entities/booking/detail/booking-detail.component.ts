import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IBooking } from '../booking.model';

@Component({
  selector: 'jhi-booking-detail',
  templateUrl: './booking-detail.component.html',
})
export class BookingDetailComponent implements OnInit {
  booking: IBooking | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ booking }) => {
      this.booking = booking;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
