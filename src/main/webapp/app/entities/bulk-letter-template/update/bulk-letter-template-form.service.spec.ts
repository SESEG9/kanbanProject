import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../bulk-letter-template.test-samples';

import { BulkLetterTemplateFormService } from './bulk-letter-template-form.service';

describe('BulkLetterTemplate Form Service', () => {
  let service: BulkLetterTemplateFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BulkLetterTemplateFormService);
  });

  describe('Service methods', () => {
    describe('createBulkLetterTemplateFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createBulkLetterTemplateFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            type: expect.any(Object),
            date: expect.any(Object),
            subject: expect.any(Object),
            content: expect.any(Object),
          })
        );
      });

      it('passing IBulkLetterTemplate should create a new form with FormGroup', () => {
        const formGroup = service.createBulkLetterTemplateFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            type: expect.any(Object),
            date: expect.any(Object),
            subject: expect.any(Object),
            content: expect.any(Object),
          })
        );
      });
    });

    describe('getBulkLetterTemplate', () => {
      it('should return NewBulkLetterTemplate for default BulkLetterTemplate initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createBulkLetterTemplateFormGroup(sampleWithNewData);

        const bulkLetterTemplate = service.getBulkLetterTemplate(formGroup) as any;

        expect(bulkLetterTemplate).toMatchObject(sampleWithNewData);
      });

      it('should return NewBulkLetterTemplate for empty BulkLetterTemplate initial value', () => {
        const formGroup = service.createBulkLetterTemplateFormGroup();

        const bulkLetterTemplate = service.getBulkLetterTemplate(formGroup) as any;

        expect(bulkLetterTemplate).toMatchObject({});
      });

      it('should return IBulkLetterTemplate', () => {
        const formGroup = service.createBulkLetterTemplateFormGroup(sampleWithRequiredData);

        const bulkLetterTemplate = service.getBulkLetterTemplate(formGroup) as any;

        expect(bulkLetterTemplate).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IBulkLetterTemplate should not enable id FormControl', () => {
        const formGroup = service.createBulkLetterTemplateFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewBulkLetterTemplate should disable id FormControl', () => {
        const formGroup = service.createBulkLetterTemplateFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
