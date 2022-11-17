import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IBooking, NewBooking } from '../booking.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IBooking for edit and NewBookingFormGroupInput for create.
 */
type BookingFormGroupInput = IBooking | PartialWithRequiredKeyOf<NewBooking>;

type BookingFormDefaults = Pick<NewBooking, 'id' | 'cancled' | 'customers' | 'rooms'>;

type BookingFormGroupContent = {
  id: FormControl<IBooking['id'] | NewBooking['id']>;
  discount: FormControl<IBooking['discount']>;
  price: FormControl<IBooking['price']>;
  startDate: FormControl<IBooking['startDate']>;
  duration: FormControl<IBooking['duration']>;
  cancled: FormControl<IBooking['cancled']>;
  customers: FormControl<IBooking['customers']>;
  rooms: FormControl<IBooking['rooms']>;
};

export type BookingFormGroup = FormGroup<BookingFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class BookingFormService {
  createBookingFormGroup(booking: BookingFormGroupInput = { id: null }): BookingFormGroup {
    const bookingRawValue = {
      ...this.getFormDefaults(),
      ...booking,
    };
    return new FormGroup<BookingFormGroupContent>({
      id: new FormControl(
        { value: bookingRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      discount: new FormControl(bookingRawValue.discount),
      price: new FormControl(bookingRawValue.price),
      startDate: new FormControl(bookingRawValue.startDate),
      duration: new FormControl(bookingRawValue.duration),
      cancled: new FormControl(bookingRawValue.cancled),
      customers: new FormControl(bookingRawValue.customers ?? []),
      rooms: new FormControl(bookingRawValue.rooms ?? []),
    });
  }

  getBooking(form: BookingFormGroup): IBooking | NewBooking {
    return form.getRawValue() as IBooking | NewBooking;
  }

  resetForm(form: BookingFormGroup, booking: BookingFormGroupInput): void {
    const bookingRawValue = { ...this.getFormDefaults(), ...booking };
    form.reset(
      {
        ...bookingRawValue,
        id: { value: bookingRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): BookingFormDefaults {
    return {
      id: null,
      cancled: false,
      customers: [],
      rooms: [],
    };
  }
}
