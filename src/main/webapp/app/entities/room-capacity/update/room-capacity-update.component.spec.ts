import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { RoomCapacityFormService } from './room-capacity-form.service';
import { RoomCapacityService } from '../service/room-capacity.service';
import { IRoomCapacity } from '../room-capacity.model';

import { RoomCapacityUpdateComponent } from './room-capacity-update.component';

describe('RoomCapacity Management Update Component', () => {
  let comp: RoomCapacityUpdateComponent;
  let fixture: ComponentFixture<RoomCapacityUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let roomCapacityFormService: RoomCapacityFormService;
  let roomCapacityService: RoomCapacityService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [RoomCapacityUpdateComponent],
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
      .overrideTemplate(RoomCapacityUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(RoomCapacityUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    roomCapacityFormService = TestBed.inject(RoomCapacityFormService);
    roomCapacityService = TestBed.inject(RoomCapacityService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const roomCapacity: IRoomCapacity = { id: 456 };

      activatedRoute.data = of({ roomCapacity });
      comp.ngOnInit();

      expect(comp.roomCapacity).toEqual(roomCapacity);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IRoomCapacity>>();
      const roomCapacity = { id: 123 };
      jest.spyOn(roomCapacityFormService, 'getRoomCapacity').mockReturnValue(roomCapacity);
      jest.spyOn(roomCapacityService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ roomCapacity });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: roomCapacity }));
      saveSubject.complete();

      // THEN
      expect(roomCapacityFormService.getRoomCapacity).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(roomCapacityService.update).toHaveBeenCalledWith(expect.objectContaining(roomCapacity));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IRoomCapacity>>();
      const roomCapacity = { id: 123 };
      jest.spyOn(roomCapacityFormService, 'getRoomCapacity').mockReturnValue({ id: null });
      jest.spyOn(roomCapacityService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ roomCapacity: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: roomCapacity }));
      saveSubject.complete();

      // THEN
      expect(roomCapacityFormService.getRoomCapacity).toHaveBeenCalled();
      expect(roomCapacityService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IRoomCapacity>>();
      const roomCapacity = { id: 123 };
      jest.spyOn(roomCapacityService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ roomCapacity });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(roomCapacityService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
