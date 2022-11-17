import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IBulkLetterTemplate, NewBulkLetterTemplate } from '../bulk-letter-template.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IBulkLetterTemplate for edit and NewBulkLetterTemplateFormGroupInput for create.
 */
type BulkLetterTemplateFormGroupInput = IBulkLetterTemplate | PartialWithRequiredKeyOf<NewBulkLetterTemplate>;

type BulkLetterTemplateFormDefaults = Pick<NewBulkLetterTemplate, 'id'>;

type BulkLetterTemplateFormGroupContent = {
  id: FormControl<IBulkLetterTemplate['id'] | NewBulkLetterTemplate['id']>;
  type: FormControl<IBulkLetterTemplate['type']>;
  date: FormControl<IBulkLetterTemplate['date']>;
  subject: FormControl<IBulkLetterTemplate['subject']>;
  content: FormControl<IBulkLetterTemplate['content']>;
};

export type BulkLetterTemplateFormGroup = FormGroup<BulkLetterTemplateFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class BulkLetterTemplateFormService {
  createBulkLetterTemplateFormGroup(bulkLetterTemplate: BulkLetterTemplateFormGroupInput = { id: null }): BulkLetterTemplateFormGroup {
    const bulkLetterTemplateRawValue = {
      ...this.getFormDefaults(),
      ...bulkLetterTemplate,
    };
    return new FormGroup<BulkLetterTemplateFormGroupContent>({
      id: new FormControl(
        { value: bulkLetterTemplateRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      type: new FormControl(bulkLetterTemplateRawValue.type),
      date: new FormControl(bulkLetterTemplateRawValue.date),
      subject: new FormControl(bulkLetterTemplateRawValue.subject),
      content: new FormControl(bulkLetterTemplateRawValue.content),
    });
  }

  getBulkLetterTemplate(form: BulkLetterTemplateFormGroup): IBulkLetterTemplate | NewBulkLetterTemplate {
    return form.getRawValue() as IBulkLetterTemplate | NewBulkLetterTemplate;
  }

  resetForm(form: BulkLetterTemplateFormGroup, bulkLetterTemplate: BulkLetterTemplateFormGroupInput): void {
    const bulkLetterTemplateRawValue = { ...this.getFormDefaults(), ...bulkLetterTemplate };
    form.reset(
      {
        ...bulkLetterTemplateRawValue,
        id: { value: bulkLetterTemplateRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): BulkLetterTemplateFormDefaults {
    return {
      id: null,
    };
  }
}
