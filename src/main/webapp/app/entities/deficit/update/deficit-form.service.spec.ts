import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../deficit.test-samples';

import { DeficitFormService } from './deficit-form.service';

describe('Deficit Form Service', () => {
  let service: DeficitFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeficitFormService);
  });

  describe('Service methods', () => {
    describe('createDeficitFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createDeficitFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            description: expect.any(Object),
            state: expect.any(Object),
            discount: expect.any(Object),
            room: expect.any(Object),
          })
        );
      });

      it('passing IDeficit should create a new form with FormGroup', () => {
        const formGroup = service.createDeficitFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            description: expect.any(Object),
            state: expect.any(Object),
            discount: expect.any(Object),
            room: expect.any(Object),
          })
        );
      });
    });

    describe('getDeficit', () => {
      it('should return NewDeficit for default Deficit initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createDeficitFormGroup(sampleWithNewData);

        const deficit = service.getDeficit(formGroup) as any;

        expect(deficit).toMatchObject(sampleWithNewData);
      });

      it('should return NewDeficit for empty Deficit initial value', () => {
        const formGroup = service.createDeficitFormGroup();

        const deficit = service.getDeficit(formGroup) as any;

        expect(deficit).toMatchObject({});
      });

      it('should return IDeficit', () => {
        const formGroup = service.createDeficitFormGroup(sampleWithRequiredData);

        const deficit = service.getDeficit(formGroup) as any;

        expect(deficit).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IDeficit should not enable id FormControl', () => {
        const formGroup = service.createDeficitFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewDeficit should disable id FormControl', () => {
        const formGroup = service.createDeficitFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
