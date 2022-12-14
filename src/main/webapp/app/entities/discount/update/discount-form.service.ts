import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IDiscount } from '../type/discount';


/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IDiscount for edit and NewDiscountFormGroupInput for create.
 */
type DiscountFormGroupInput = IDiscount;
type DiscountFormDefaults = IDiscount;
type DiscountFormGroupContent = {
  discountCode: FormControl<IDiscount['discountCode']>;
  discountPercentage: FormControl<IDiscount['discountPercentage'] | undefined>;
};

export type DiscountFormGroup = FormGroup<DiscountFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class DiscountFormService {
  createDiscountFormGroup(Discount: DiscountFormGroupInput = { discountCode: "", discountPercentage: 0 }): DiscountFormGroup {
    const DiscountRawValue = {
      ...this.getFormDefaults(),
      ...Discount,
    };
    return new FormGroup<DiscountFormGroupContent>({
      discountCode: new FormControl(
        { value: DiscountRawValue.discountCode, disabled: false },
        {
          nonNullable: true,
          validators: [Validators.required, Validators.minLength(5), Validators.maxLength(10)],
        }
      ),
      discountPercentage: new FormControl(
        { value: DiscountRawValue.discountPercentage, disabled: false },
        {
          nonNullable: true,
          validators: [Validators.required, Validators.pattern("^[1-9][0-9]?$|^100$"), Validators.min(1), Validators.max(100)]
        }
      ),
    });
  }

  getDiscount(form: DiscountFormGroup): IDiscount {
    return form.getRawValue() as IDiscount;
  }

  resetForm(form: DiscountFormGroup, Discount: DiscountFormGroupInput): void {
    const DiscountRawValue = { ...this.getFormDefaults(), ...Discount };
    form.reset(
      {
        ...DiscountRawValue,
        discountCode: DiscountRawValue.discountCode,
        discountPercentage: 0
      }  /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): DiscountFormDefaults {
    return {
      discountCode: "",
      discountPercentage: 0
    };
  }
}
