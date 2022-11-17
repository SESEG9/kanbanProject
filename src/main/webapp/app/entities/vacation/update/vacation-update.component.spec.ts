import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { VacationFormService } from './vacation-form.service';
import { VacationService } from '../service/vacation.service';
import { IVacation } from '../vacation.model';
import { IHumanResource } from 'app/entities/human-resource/human-resource.model';
import { HumanResourceService } from 'app/entities/human-resource/service/human-resource.service';

import { VacationUpdateComponent } from './vacation-update.component';

describe('Vacation Management Update Component', () => {
  let comp: VacationUpdateComponent;
  let fixture: ComponentFixture<VacationUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let vacationFormService: VacationFormService;
  let vacationService: VacationService;
  let humanResourceService: HumanResourceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [VacationUpdateComponent],
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
      .overrideTemplate(VacationUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(VacationUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    vacationFormService = TestBed.inject(VacationFormService);
    vacationService = TestBed.inject(VacationService);
    humanResourceService = TestBed.inject(HumanResourceService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call HumanResource query and add missing value', () => {
      const vacation: IVacation = { id: 456 };
      const humanResource: IHumanResource = { id: 14310 };
      vacation.humanResource = humanResource;

      const humanResourceCollection: IHumanResource[] = [{ id: 87385 }];
      jest.spyOn(humanResourceService, 'query').mockReturnValue(of(new HttpResponse({ body: humanResourceCollection })));
      const additionalHumanResources = [humanResource];
      const expectedCollection: IHumanResource[] = [...additionalHumanResources, ...humanResourceCollection];
      jest.spyOn(humanResourceService, 'addHumanResourceToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ vacation });
      comp.ngOnInit();

      expect(humanResourceService.query).toHaveBeenCalled();
      expect(humanResourceService.addHumanResourceToCollectionIfMissing).toHaveBeenCalledWith(
        humanResourceCollection,
        ...additionalHumanResources.map(expect.objectContaining)
      );
      expect(comp.humanResourcesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const vacation: IVacation = { id: 456 };
      const humanResource: IHumanResource = { id: 95620 };
      vacation.humanResource = humanResource;

      activatedRoute.data = of({ vacation });
      comp.ngOnInit();

      expect(comp.humanResourcesSharedCollection).toContain(humanResource);
      expect(comp.vacation).toEqual(vacation);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IVacation>>();
      const vacation = { id: 123 };
      jest.spyOn(vacationFormService, 'getVacation').mockReturnValue(vacation);
      jest.spyOn(vacationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ vacation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: vacation }));
      saveSubject.complete();

      // THEN
      expect(vacationFormService.getVacation).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(vacationService.update).toHaveBeenCalledWith(expect.objectContaining(vacation));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IVacation>>();
      const vacation = { id: 123 };
      jest.spyOn(vacationFormService, 'getVacation').mockReturnValue({ id: null });
      jest.spyOn(vacationService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ vacation: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: vacation }));
      saveSubject.complete();

      // THEN
      expect(vacationFormService.getVacation).toHaveBeenCalled();
      expect(vacationService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IVacation>>();
      const vacation = { id: 123 };
      jest.spyOn(vacationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ vacation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(vacationService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareHumanResource', () => {
      it('Should forward to humanResourceService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(humanResourceService, 'compareHumanResource');
        comp.compareHumanResource(entity, entity2);
        expect(humanResourceService.compareHumanResource).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
