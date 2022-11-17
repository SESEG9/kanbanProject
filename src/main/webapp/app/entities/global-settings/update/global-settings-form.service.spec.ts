import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../global-settings.test-samples';

import { GlobalSettingsFormService } from './global-settings-form.service';

describe('GlobalSettings Form Service', () => {
  let service: GlobalSettingsFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlobalSettingsFormService);
  });

  describe('Service methods', () => {
    describe('createGlobalSettingsFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createGlobalSettingsFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            cancelTime: expect.any(Object),
          })
        );
      });

      it('passing IGlobalSettings should create a new form with FormGroup', () => {
        const formGroup = service.createGlobalSettingsFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            cancelTime: expect.any(Object),
          })
        );
      });
    });

    describe('getGlobalSettings', () => {
      it('should return NewGlobalSettings for default GlobalSettings initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createGlobalSettingsFormGroup(sampleWithNewData);

        const globalSettings = service.getGlobalSettings(formGroup) as any;

        expect(globalSettings).toMatchObject(sampleWithNewData);
      });

      it('should return NewGlobalSettings for empty GlobalSettings initial value', () => {
        const formGroup = service.createGlobalSettingsFormGroup();

        const globalSettings = service.getGlobalSettings(formGroup) as any;

        expect(globalSettings).toMatchObject({});
      });

      it('should return IGlobalSettings', () => {
        const formGroup = service.createGlobalSettingsFormGroup(sampleWithRequiredData);

        const globalSettings = service.getGlobalSettings(formGroup) as any;

        expect(globalSettings).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IGlobalSettings should not enable id FormControl', () => {
        const formGroup = service.createGlobalSettingsFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewGlobalSettings should disable id FormControl', () => {
        const formGroup = service.createGlobalSettingsFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
