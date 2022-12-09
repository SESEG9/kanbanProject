import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { Booking, IBooking } from '../booking.model';
import { BookingService } from '../service/booking.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './booking-delete-dialog.component.html',
})
export class BookingDeleteDialogComponent {
  booking!: Booking;

  constructor(protected bookingService: BookingService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.bookingService.delete(this.booking.id, this.booking.billingCustomer.email, this.booking.bookingCode).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
