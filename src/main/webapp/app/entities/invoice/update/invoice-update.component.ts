import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { InvoiceFormGroup, InvoiceFormService } from './invoice-form.service';
import { IInvoice } from '../invoice.model';
import { InvoiceService } from '../service/invoice.service';
import { BookingService } from '../../booking/service/booking.service';
import { Booking, IBooking } from '../../booking/booking.model';
import { Customer } from '../../../reservation/reservation.model';

@Component({
  selector: 'jhi-invoice-update',
  templateUrl: './invoice-update.component.html',
  styleUrls: ['./invoice-update.component.scss'],
})
export class InvoiceUpdateComponent implements OnInit {
  isSaving = false;
  invoice: IInvoice | null = null;
  bookings: Booking[] | null = null;
  editForm: InvoiceFormGroup = this.invoiceFormService.createInvoiceFormGroup();

  constructor(
    protected invoiceService: InvoiceService,
    protected invoiceFormService: InvoiceFormService,
    protected bookingService: BookingService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ invoice }) => {
      this.invoice = invoice;
      this.loadBookings();
      if (invoice) {
        invoice.bookingId = invoice.booking.id;
        this.updateForm(invoice);
      }
    });
  }

  compareBooking = (o1: IBooking | null, o2: IBooking | null): boolean => this.bookingService.compareBooking(o1, o2);

  loadBookings(): void {
    this.bookingService.query().subscribe({
      next: response => {
        this.bookings = response.filter(b => !b.cancled);
      },
    });
  }

  updateData(): void {
    const booking = this.editForm.getRawValue().booking as Booking | null;
    const customer = booking?.billingCustomer as Customer | null;
    this.editForm.patchValue({
      bookingId: booking?.id,
      customerAddress: customer?.billingAddress,
      discount: booking?.discount,
      price: booking?.price,
      duration: booking?.duration,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const invoice = this.invoiceFormService.getInvoice(this.editForm);
    if (invoice.id !== null) {
      this.subscribeToSaveResponse(this.invoiceService.update(invoice));
    } else {
      this.subscribeToSaveResponse(this.invoiceService.create(invoice));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IInvoice>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(invoice: IInvoice): void {
    this.invoice = invoice;
    this.invoiceFormService.resetForm(this.editForm, invoice);
  }
}
