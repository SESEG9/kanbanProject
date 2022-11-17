import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { GlobalSettingsFormService } from './global-settings-form.service';
import { GlobalSettingsService } from '../service/global-settings.service';
import { IGlobalSettings } from '../global-settings.model';

import { GlobalSettingsUpdateComponent } from './global-settings-update.component';

describe('GlobalSettings Management Update Component', () => {
  let comp: GlobalSettingsUpdateComponent;
  let fixture: ComponentFixture<GlobalSettingsUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let globalSettingsFormService: GlobalSettingsFormService;
  let globalSettingsService: GlobalSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [GlobalSettingsUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(GlobalSettingsUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(GlobalSettingsUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    globalSettingsFormService = TestBed.inject(GlobalSettingsFormService);
    globalSettingsService = TestBed.inject(GlobalSettingsService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const globalSettings: IGlobalSettings = { id: 456 };

      activatedRoute.data = of({ globalSettings });
      comp.ngOnInit();

      expect(comp.globalSettings).toEqual(globalSettings);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IGlobalSettings>>();
      const globalSettings = { id: 123 };
      jest.spyOn(globalSettingsFormService, 'getGlobalSettings').mockReturnValue(globalSettings);
      jest.spyOn(globalSettingsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ globalSettings });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: globalSettings }));
      saveSubject.complete();

      // THEN
      expect(globalSettingsFormService.getGlobalSettings).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(globalSettingsService.update).toHaveBeenCalledWith(expect.objectContaining(globalSettings));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IGlobalSettings>>();
      const globalSettings = { id: 123 };
      jest.spyOn(globalSettingsFormService, 'getGlobalSettings').mockReturnValue({ id: null });
      jest.spyOn(globalSettingsService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ globalSettings: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: globalSettings }));
      saveSubject.complete();

      // THEN
      expect(globalSettingsFormService.getGlobalSettings).toHaveBeenCalled();
      expect(globalSettingsService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IGlobalSettings>>();
      const globalSettings = { id: 123 };
      jest.spyOn(globalSettingsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ globalSettings });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(globalSettingsService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
