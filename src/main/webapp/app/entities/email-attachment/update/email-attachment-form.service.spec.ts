import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../email-attachment.test-samples';

import { EmailAttachmentFormService } from './email-attachment-form.service';

describe('EmailAttachment Form Service', () => {
  let service: EmailAttachmentFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmailAttachmentFormService);
  });

  describe('Service methods', () => {
    describe('createEmailAttachmentFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createEmailAttachmentFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            image: expect.any(Object),
            bulkLetterTemplate: expect.any(Object),
          })
        );
      });

      it('passing IEmailAttachment should create a new form with FormGroup', () => {
        const formGroup = service.createEmailAttachmentFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            image: expect.any(Object),
            bulkLetterTemplate: expect.any(Object),
          })
        );
      });
    });

    describe('getEmailAttachment', () => {
      it('should return NewEmailAttachment for default EmailAttachment initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createEmailAttachmentFormGroup(sampleWithNewData);

        const emailAttachment = service.getEmailAttachment(formGroup) as any;

        expect(emailAttachment).toMatchObject(sampleWithNewData);
      });

      it('should return NewEmailAttachment for empty EmailAttachment initial value', () => {
        const formGroup = service.createEmailAttachmentFormGroup();

        const emailAttachment = service.getEmailAttachment(formGroup) as any;

        expect(emailAttachment).toMatchObject({});
      });

      it('should return IEmailAttachment', () => {
        const formGroup = service.createEmailAttachmentFormGroup(sampleWithRequiredData);

        const emailAttachment = service.getEmailAttachment(formGroup) as any;

        expect(emailAttachment).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IEmailAttachment should not enable id FormControl', () => {
        const formGroup = service.createEmailAttachmentFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewEmailAttachment should disable id FormControl', () => {
        const formGroup = service.createEmailAttachmentFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
