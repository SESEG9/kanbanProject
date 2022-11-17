import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../human-resource.test-samples';

import { HumanResourceFormService } from './human-resource-form.service';

describe('HumanResource Form Service', () => {
  let service: HumanResourceFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HumanResourceFormService);
  });

  describe('Service methods', () => {
    describe('createHumanResourceFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createHumanResourceFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            type: expect.any(Object),
            abbr: expect.any(Object),
            name: expect.any(Object),
            birthday: expect.any(Object),
            gender: expect.any(Object),
            phone: expect.any(Object),
            email: expect.any(Object),
            ssn: expect.any(Object),
            bannking: expect.any(Object),
            relationshipType: expect.any(Object),
          })
        );
      });

      it('passing IHumanResource should create a new form with FormGroup', () => {
        const formGroup = service.createHumanResourceFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            type: expect.any(Object),
            abbr: expect.any(Object),
            name: expect.any(Object),
            birthday: expect.any(Object),
            gender: expect.any(Object),
            phone: expect.any(Object),
            email: expect.any(Object),
            ssn: expect.any(Object),
            bannking: expect.any(Object),
            relationshipType: expect.any(Object),
          })
        );
      });
    });

    describe('getHumanResource', () => {
      it('should return NewHumanResource for default HumanResource initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createHumanResourceFormGroup(sampleWithNewData);

        const humanResource = service.getHumanResource(formGroup) as any;

        expect(humanResource).toMatchObject(sampleWithNewData);
      });

      it('should return NewHumanResource for empty HumanResource initial value', () => {
        const formGroup = service.createHumanResourceFormGroup();

        const humanResource = service.getHumanResource(formGroup) as any;

        expect(humanResource).toMatchObject({});
      });

      it('should return IHumanResource', () => {
        const formGroup = service.createHumanResourceFormGroup(sampleWithRequiredData);

        const humanResource = service.getHumanResource(formGroup) as any;

        expect(humanResource).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IHumanResource should not enable id FormControl', () => {
        const formGroup = service.createHumanResourceFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewHumanResource should disable id FormControl', () => {
        const formGroup = service.createHumanResourceFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
