import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { BulkLetterTemplateFormService } from './bulk-letter-template-form.service';
import { BulkLetterTemplateService } from '../service/bulk-letter-template.service';
import { IBulkLetterTemplate } from '../bulk-letter-template.model';

import { BulkLetterTemplateUpdateComponent } from './bulk-letter-template-update.component';

describe('BulkLetterTemplate Management Update Component', () => {
  let comp: BulkLetterTemplateUpdateComponent;
  let fixture: ComponentFixture<BulkLetterTemplateUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let bulkLetterTemplateFormService: BulkLetterTemplateFormService;
  let bulkLetterTemplateService: BulkLetterTemplateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [BulkLetterTemplateUpdateComponent],
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
      .overrideTemplate(BulkLetterTemplateUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(BulkLetterTemplateUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    bulkLetterTemplateFormService = TestBed.inject(BulkLetterTemplateFormService);
    bulkLetterTemplateService = TestBed.inject(BulkLetterTemplateService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const bulkLetterTemplate: IBulkLetterTemplate = { id: 456 };

      activatedRoute.data = of({ bulkLetterTemplate });
      comp.ngOnInit();

      expect(comp.bulkLetterTemplate).toEqual(bulkLetterTemplate);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBulkLetterTemplate>>();
      const bulkLetterTemplate = { id: 123 };
      jest.spyOn(bulkLetterTemplateFormService, 'getBulkLetterTemplate').mockReturnValue(bulkLetterTemplate);
      jest.spyOn(bulkLetterTemplateService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ bulkLetterTemplate });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: bulkLetterTemplate }));
      saveSubject.complete();

      // THEN
      expect(bulkLetterTemplateFormService.getBulkLetterTemplate).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(bulkLetterTemplateService.update).toHaveBeenCalledWith(expect.objectContaining(bulkLetterTemplate));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBulkLetterTemplate>>();
      const bulkLetterTemplate = { id: 123 };
      jest.spyOn(bulkLetterTemplateFormService, 'getBulkLetterTemplate').mockReturnValue({ id: null });
      jest.spyOn(bulkLetterTemplateService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ bulkLetterTemplate: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: bulkLetterTemplate }));
      saveSubject.complete();

      // THEN
      expect(bulkLetterTemplateFormService.getBulkLetterTemplate).toHaveBeenCalled();
      expect(bulkLetterTemplateService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBulkLetterTemplate>>();
      const bulkLetterTemplate = { id: 123 };
      jest.spyOn(bulkLetterTemplateService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ bulkLetterTemplate });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(bulkLetterTemplateService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
