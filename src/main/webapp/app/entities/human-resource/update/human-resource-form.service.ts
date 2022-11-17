import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IHumanResource, NewHumanResource } from '../human-resource.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IHumanResource for edit and NewHumanResourceFormGroupInput for create.
 */
type HumanResourceFormGroupInput = IHumanResource | PartialWithRequiredKeyOf<NewHumanResource>;

type HumanResourceFormDefaults = Pick<NewHumanResource, 'id'>;

type HumanResourceFormGroupContent = {
  id: FormControl<IHumanResource['id'] | NewHumanResource['id']>;
  type: FormControl<IHumanResource['type']>;
  abbr: FormControl<IHumanResource['abbr']>;
  name: FormControl<IHumanResource['name']>;
  birthday: FormControl<IHumanResource['birthday']>;
  gender: FormControl<IHumanResource['gender']>;
  phone: FormControl<IHumanResource['phone']>;
  email: FormControl<IHumanResource['email']>;
  ssn: FormControl<IHumanResource['ssn']>;
  bannking: FormControl<IHumanResource['bannking']>;
  relationshipType: FormControl<IHumanResource['relationshipType']>;
};

export type HumanResourceFormGroup = FormGroup<HumanResourceFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class HumanResourceFormService {
  createHumanResourceFormGroup(humanResource: HumanResourceFormGroupInput = { id: null }): HumanResourceFormGroup {
    const humanResourceRawValue = {
      ...this.getFormDefaults(),
      ...humanResource,
    };
    return new FormGroup<HumanResourceFormGroupContent>({
      id: new FormControl(
        { value: humanResourceRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      type: new FormControl(humanResourceRawValue.type),
      abbr: new FormControl(humanResourceRawValue.abbr, {
        validators: [Validators.required],
      }),
      name: new FormControl(humanResourceRawValue.name, {
        validators: [Validators.required],
      }),
      birthday: new FormControl(humanResourceRawValue.birthday, {
        validators: [Validators.required],
      }),
      gender: new FormControl(humanResourceRawValue.gender, {
        validators: [Validators.required],
      }),
      phone: new FormControl(humanResourceRawValue.phone),
      email: new FormControl(humanResourceRawValue.email),
      ssn: new FormControl(humanResourceRawValue.ssn),
      bannking: new FormControl(humanResourceRawValue.bannking),
      relationshipType: new FormControl(humanResourceRawValue.relationshipType),
    });
  }

  getHumanResource(form: HumanResourceFormGroup): IHumanResource | NewHumanResource {
    return form.getRawValue() as IHumanResource | NewHumanResource;
  }

  resetForm(form: HumanResourceFormGroup, humanResource: HumanResourceFormGroupInput): void {
    const humanResourceRawValue = { ...this.getFormDefaults(), ...humanResource };
    form.reset(
      {
        ...humanResourceRawValue,
        id: { value: humanResourceRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): HumanResourceFormDefaults {
    return {
      id: null,
    };
  }
}
