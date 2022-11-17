import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IEmailAttachment, NewEmailAttachment } from '../email-attachment.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IEmailAttachment for edit and NewEmailAttachmentFormGroupInput for create.
 */
type EmailAttachmentFormGroupInput = IEmailAttachment | PartialWithRequiredKeyOf<NewEmailAttachment>;

type EmailAttachmentFormDefaults = Pick<NewEmailAttachment, 'id'>;

type EmailAttachmentFormGroupContent = {
  id: FormControl<IEmailAttachment['id'] | NewEmailAttachment['id']>;
  image: FormControl<IEmailAttachment['image']>;
  imageContentType: FormControl<IEmailAttachment['imageContentType']>;
  bulkLetterTemplate: FormControl<IEmailAttachment['bulkLetterTemplate']>;
};

export type EmailAttachmentFormGroup = FormGroup<EmailAttachmentFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class EmailAttachmentFormService {
  createEmailAttachmentFormGroup(emailAttachment: EmailAttachmentFormGroupInput = { id: null }): EmailAttachmentFormGroup {
    const emailAttachmentRawValue = {
      ...this.getFormDefaults(),
      ...emailAttachment,
    };
    return new FormGroup<EmailAttachmentFormGroupContent>({
      id: new FormControl(
        { value: emailAttachmentRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      image: new FormControl(emailAttachmentRawValue.image),
      imageContentType: new FormControl(emailAttachmentRawValue.imageContentType),
      bulkLetterTemplate: new FormControl(emailAttachmentRawValue.bulkLetterTemplate),
    });
  }

  getEmailAttachment(form: EmailAttachmentFormGroup): IEmailAttachment | NewEmailAttachment {
    return form.getRawValue() as IEmailAttachment | NewEmailAttachment;
  }

  resetForm(form: EmailAttachmentFormGroup, emailAttachment: EmailAttachmentFormGroupInput): void {
    const emailAttachmentRawValue = { ...this.getFormDefaults(), ...emailAttachment };
    form.reset(
      {
        ...emailAttachmentRawValue,
        id: { value: emailAttachmentRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): EmailAttachmentFormDefaults {
    return {
      id: null,
    };
  }
}
