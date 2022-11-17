import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ICustomer, NewCustomer } from '../customer.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ICustomer for edit and NewCustomerFormGroupInput for create.
 */
type CustomerFormGroupInput = ICustomer | PartialWithRequiredKeyOf<NewCustomer>;

type CustomerFormDefaults = Pick<NewCustomer, 'id' | 'bookings'>;

type CustomerFormGroupContent = {
  id: FormControl<ICustomer['id'] | NewCustomer['id']>;
  name: FormControl<ICustomer['name']>;
  birthday: FormControl<ICustomer['birthday']>;
  gender: FormControl<ICustomer['gender']>;
  billingAddress: FormControl<ICustomer['billingAddress']>;
  companyName: FormControl<ICustomer['companyName']>;
  note: FormControl<ICustomer['note']>;
  discount: FormControl<ICustomer['discount']>;
  telephone: FormControl<ICustomer['telephone']>;
  email: FormControl<ICustomer['email']>;
  web: FormControl<ICustomer['web']>;
  fax: FormControl<ICustomer['fax']>;
  bookings: FormControl<ICustomer['bookings']>;
};

export type CustomerFormGroup = FormGroup<CustomerFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class CustomerFormService {
  createCustomerFormGroup(customer: CustomerFormGroupInput = { id: null }): CustomerFormGroup {
    const customerRawValue = {
      ...this.getFormDefaults(),
      ...customer,
    };
    return new FormGroup<CustomerFormGroupContent>({
      id: new FormControl(
        { value: customerRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      name: new FormControl(customerRawValue.name, {
        validators: [Validators.required],
      }),
      birthday: new FormControl(customerRawValue.birthday, {
        validators: [Validators.required],
      }),
      gender: new FormControl(customerRawValue.gender, {
        validators: [Validators.required],
      }),
      billingAddress: new FormControl(customerRawValue.billingAddress, {
        validators: [Validators.required],
      }),
      companyName: new FormControl(customerRawValue.companyName),
      note: new FormControl(customerRawValue.note),
      discount: new FormControl(customerRawValue.discount),
      telephone: new FormControl(customerRawValue.telephone, {
        validators: [Validators.required],
      }),
      email: new FormControl(customerRawValue.email, {
        validators: [Validators.required],
      }),
      web: new FormControl(customerRawValue.web),
      fax: new FormControl(customerRawValue.fax),
      bookings: new FormControl(customerRawValue.bookings ?? []),
    });
  }

  getCustomer(form: CustomerFormGroup): ICustomer | NewCustomer {
    return form.getRawValue() as ICustomer | NewCustomer;
  }

  resetForm(form: CustomerFormGroup, customer: CustomerFormGroupInput): void {
    const customerRawValue = { ...this.getFormDefaults(), ...customer };
    form.reset(
      {
        ...customerRawValue,
        id: { value: customerRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): CustomerFormDefaults {
    return {
      id: null,
      bookings: [],
    };
  }
}
