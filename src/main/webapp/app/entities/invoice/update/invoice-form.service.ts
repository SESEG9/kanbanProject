import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IInvoice, NewInvoice } from '../invoice.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IInvoice for edit and NewInvoiceFormGroupInput for create.
 */
type InvoiceFormGroupInput = IInvoice | PartialWithRequiredKeyOf<NewInvoice>;

type InvoiceFormDefaults = Pick<NewInvoice, 'id' | 'cancled'>;

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

@Injectable({ providedIn: 'root' })
export class InvoiceFormService {
  createInvoiceFormGroup(invoice: InvoiceFormGroupInput = { id: null }): InvoiceFormGroup {
    const invoiceRawValue = {
      ...this.getFormDefaults(),
      ...invoice,
    };
    return new FormGroup<InvoiceFormGroupContent>({
      id: new FormControl(
        { value: invoiceRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      hotelAddress: new FormControl(invoiceRawValue.hotelAddress),
      customerAddress: new FormControl(invoiceRawValue.customerAddress),
      discount: new FormControl(invoiceRawValue.discount),
      price: new FormControl(invoiceRawValue.price),
      duration: new FormControl(invoiceRawValue.duration),
      billingDate: new FormControl(invoiceRawValue.billingDate),
      cancled: new FormControl(invoiceRawValue.cancled),
    });
  }

  getInvoice(form: InvoiceFormGroup): IInvoice | NewInvoice {
    return form.getRawValue() as IInvoice | NewInvoice;
  }

  resetForm(form: InvoiceFormGroup, invoice: InvoiceFormGroupInput): void {
    const invoiceRawValue = { ...this.getFormDefaults(), ...invoice };
    form.reset(
      {
        ...invoiceRawValue,
        id: { value: invoiceRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): InvoiceFormDefaults {
    return {
      id: null,
      cancled: false,
    };
  }
}
