import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IGlobalSettings, NewGlobalSettings } from '../global-settings.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IGlobalSettings for edit and NewGlobalSettingsFormGroupInput for create.
 */
type GlobalSettingsFormGroupInput = IGlobalSettings | PartialWithRequiredKeyOf<NewGlobalSettings>;

type GlobalSettingsFormDefaults = Pick<NewGlobalSettings, 'id'>;

type GlobalSettingsFormGroupContent = {
  id: FormControl<IGlobalSettings['id'] | NewGlobalSettings['id']>;
  cancelTime: FormControl<IGlobalSettings['cancelTime']>;
};

export type GlobalSettingsFormGroup = FormGroup<GlobalSettingsFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class GlobalSettingsFormService {
  createGlobalSettingsFormGroup(globalSettings: GlobalSettingsFormGroupInput = { id: null }): GlobalSettingsFormGroup {
    const globalSettingsRawValue = {
      ...this.getFormDefaults(),
      ...globalSettings,
    };
    return new FormGroup<GlobalSettingsFormGroupContent>({
      id: new FormControl(
        { value: globalSettingsRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      cancelTime: new FormControl(globalSettingsRawValue.cancelTime),
    });
  }

  getGlobalSettings(form: GlobalSettingsFormGroup): IGlobalSettings | NewGlobalSettings {
    return form.getRawValue() as IGlobalSettings | NewGlobalSettings;
  }

  resetForm(form: GlobalSettingsFormGroup, globalSettings: GlobalSettingsFormGroupInput): void {
    const globalSettingsRawValue = { ...this.getFormDefaults(), ...globalSettings };
    form.reset(
      {
        ...globalSettingsRawValue,
        id: { value: globalSettingsRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): GlobalSettingsFormDefaults {
    return {
      id: null,
    };
  }
}
