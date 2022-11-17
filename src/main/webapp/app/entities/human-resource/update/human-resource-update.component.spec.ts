import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { HumanResourceFormService } from './human-resource-form.service';
import { HumanResourceService } from '../service/human-resource.service';
import { IHumanResource } from '../human-resource.model';

import { HumanResourceUpdateComponent } from './human-resource-update.component';

describe('HumanResource Management Update Component', () => {
  let comp: HumanResourceUpdateComponent;
  let fixture: ComponentFixture<HumanResourceUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let humanResourceFormService: HumanResourceFormService;
  let humanResourceService: HumanResourceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [HumanResourceUpdateComponent],
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
      .overrideTemplate(HumanResourceUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(HumanResourceUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    humanResourceFormService = TestBed.inject(HumanResourceFormService);
    humanResourceService = TestBed.inject(HumanResourceService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const humanResource: IHumanResource = { id: 456 };

      activatedRoute.data = of({ humanResource });
      comp.ngOnInit();

      expect(comp.humanResource).toEqual(humanResource);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IHumanResource>>();
      const humanResource = { id: 123 };
      jest.spyOn(humanResourceFormService, 'getHumanResource').mockReturnValue(humanResource);
      jest.spyOn(humanResourceService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ humanResource });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: humanResource }));
      saveSubject.complete();

      // THEN
      expect(humanResourceFormService.getHumanResource).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(humanResourceService.update).toHaveBeenCalledWith(expect.objectContaining(humanResource));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IHumanResource>>();
      const humanResource = { id: 123 };
      jest.spyOn(humanResourceFormService, 'getHumanResource').mockReturnValue({ id: null });
      jest.spyOn(humanResourceService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ humanResource: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: humanResource }));
      saveSubject.complete();

      // THEN
      expect(humanResourceFormService.getHumanResource).toHaveBeenCalled();
      expect(humanResourceService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IHumanResource>>();
      const humanResource = { id: 123 };
      jest.spyOn(humanResourceService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ humanResource });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(humanResourceService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
