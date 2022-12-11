import {Injectable} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

import {IInvoice, NewInvoice} from '../invoice.model';
import {HOTEL_ADDRESS} from '../../../app.constants';
import dayjs from 'dayjs/esm';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IInvoice for edit and NewInvoiceFormGroupInput for create.
 */
type InvoiceFormGroupInput = IInvoice | PartialWithRequiredKeyOf<NewInvoice>;

type InvoiceFormDefaults = Pick<NewInvoice, 'id' | 'cancled' | 'hotelAddress' | 'billingDate'>;

type InvoiceFormGroupContent = {
  id: FormControl<IInvoice['id'] | NewInvoice['id']>;
  hotelAddress: FormControl<IInvoice['hotelAddress']>;
  customerAddress: FormControl<IInvoice['customerAddress']>;
  discount: FormControl<IInvoice['discount']>;
  price: FormControl<IInvoice['price']>;
  duration: FormControl<IInvoice['duration']>;
  billingDate: FormControl<IInvoice['billingDate']>;
  cancled: FormControl<IInvoice['cancled']>;
};

export type InvoiceFormGroup = FormGroup<InvoiceFormGroupContent>;

@Injectable({providedIn: 'root'})
export class InvoiceFormService {
  createInvoiceFormGroup(invoice: InvoiceFormGroupInput = {id: null}): InvoiceFormGroup {
    const invoiceRawValue = {
      ...this.getFormDefaults(),
      ...invoice,
    };
    return new FormGroup<InvoiceFormGroupContent>({
      id: new FormControl(
        {value: invoiceRawValue.id, disabled: true},
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      hotelAddress: new FormControl(invoiceRawValue.hotelAddress, [Validators.required, Validators.minLength(5)]),
      customerAddress: new FormControl(invoiceRawValue.customerAddress, [Validators.required, Validators.minLength(5)]),
      discount: new FormControl(invoiceRawValue.discount),
      price: new FormControl(invoiceRawValue.price, [Validators.required, Validators.min(0)]),
      duration: new FormControl(invoiceRawValue.duration, [Validators.required, Validators.min(0)]),
      billingDate: new FormControl(invoiceRawValue.billingDate, [Validators.required]),
      cancled: new FormControl(invoiceRawValue.cancled),
    });
  }

  getInvoice(form: InvoiceFormGroup): IInvoice | NewInvoice {
    return form.getRawValue() as IInvoice | NewInvoice;
  }

  resetForm(form: InvoiceFormGroup, invoice: InvoiceFormGroupInput): void {
    const invoiceRawValue = {...this.getFormDefaults(), ...invoice};
    form.reset(
      {
        ...invoiceRawValue,
        id: {value: invoiceRawValue.id, disabled: true},
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): InvoiceFormDefaults {
    return {
      id: null,
      cancled: false,
      hotelAddress: HOTEL_ADDRESS,
      billingDate: dayjs(new Date()),
    };
  }
}
