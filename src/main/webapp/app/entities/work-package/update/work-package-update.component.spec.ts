import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { WorkPackageFormService } from './work-package-form.service';
import { WorkPackageService } from '../service/work-package.service';
import { IWorkPackage } from '../work-package.model';
import { IHumanResource } from 'app/entities/human-resource/human-resource.model';
import { HumanResourceService } from 'app/entities/human-resource/service/human-resource.service';

import { WorkPackageUpdateComponent } from './work-package-update.component';

describe('WorkPackage Management Update Component', () => {
  let comp: WorkPackageUpdateComponent;
  let fixture: ComponentFixture<WorkPackageUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let workPackageFormService: WorkPackageFormService;
  let workPackageService: WorkPackageService;
  let humanResourceService: HumanResourceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [WorkPackageUpdateComponent],
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
      .overrideTemplate(WorkPackageUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(WorkPackageUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    workPackageFormService = TestBed.inject(WorkPackageFormService);
    workPackageService = TestBed.inject(WorkPackageService);
    humanResourceService = TestBed.inject(HumanResourceService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call HumanResource query and add missing value', () => {
      const workPackage: IWorkPackage = { id: 456 };
      const humanResource: IHumanResource = { id: 85180 };
      workPackage.humanResource = humanResource;

      const humanResourceCollection: IHumanResource[] = [{ id: 66784 }];
      jest.spyOn(humanResourceService, 'query').mockReturnValue(of(new HttpResponse({ body: humanResourceCollection })));
      const additionalHumanResources = [humanResource];
      const expectedCollection: IHumanResource[] = [...additionalHumanResources, ...humanResourceCollection];
      jest.spyOn(humanResourceService, 'addHumanResourceToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ workPackage });
      comp.ngOnInit();

      expect(humanResourceService.query).toHaveBeenCalled();
      expect(humanResourceService.addHumanResourceToCollectionIfMissing).toHaveBeenCalledWith(
        humanResourceCollection,
        ...additionalHumanResources.map(expect.objectContaining)
      );
      expect(comp.humanResourcesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const workPackage: IWorkPackage = { id: 456 };
      const humanResource: IHumanResource = { id: 38337 };
      workPackage.humanResource = humanResource;

      activatedRoute.data = of({ workPackage });
      comp.ngOnInit();

      expect(comp.humanResourcesSharedCollection).toContain(humanResource);
      expect(comp.workPackage).toEqual(workPackage);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IWorkPackage>>();
      const workPackage = { id: 123 };
      jest.spyOn(workPackageFormService, 'getWorkPackage').mockReturnValue(workPackage);
      jest.spyOn(workPackageService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ workPackage });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: workPackage }));
      saveSubject.complete();

      // THEN
      expect(workPackageFormService.getWorkPackage).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(workPackageService.update).toHaveBeenCalledWith(expect.objectContaining(workPackage));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IWorkPackage>>();
      const workPackage = { id: 123 };
      jest.spyOn(workPackageFormService, 'getWorkPackage').mockReturnValue({ id: null });
      jest.spyOn(workPackageService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ workPackage: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: workPackage }));
      saveSubject.complete();

      // THEN
      expect(workPackageFormService.getWorkPackage).toHaveBeenCalled();
      expect(workPackageService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IWorkPackage>>();
      const workPackage = { id: 123 };
      jest.spyOn(workPackageService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ workPackage });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(workPackageService.update).toHaveBeenCalled();
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
