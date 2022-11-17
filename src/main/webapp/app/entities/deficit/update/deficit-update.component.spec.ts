import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { DeficitFormService } from './deficit-form.service';
import { DeficitService } from '../service/deficit.service';
import { IDeficit } from '../deficit.model';
import { IRoom } from 'app/entities/room/room.model';
import { RoomService } from 'app/entities/room/service/room.service';

import { DeficitUpdateComponent } from './deficit-update.component';

describe('Deficit Management Update Component', () => {
  let comp: DeficitUpdateComponent;
  let fixture: ComponentFixture<DeficitUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let deficitFormService: DeficitFormService;
  let deficitService: DeficitService;
  let roomService: RoomService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [DeficitUpdateComponent],
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
      .overrideTemplate(DeficitUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(DeficitUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    deficitFormService = TestBed.inject(DeficitFormService);
    deficitService = TestBed.inject(DeficitService);
    roomService = TestBed.inject(RoomService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Room query and add missing value', () => {
      const deficit: IDeficit = { id: 456 };
      const room: IRoom = { id: 62766 };
      deficit.room = room;

      const roomCollection: IRoom[] = [{ id: 13624 }];
      jest.spyOn(roomService, 'query').mockReturnValue(of(new HttpResponse({ body: roomCollection })));
      const additionalRooms = [room];
      const expectedCollection: IRoom[] = [...additionalRooms, ...roomCollection];
      jest.spyOn(roomService, 'addRoomToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ deficit });
      comp.ngOnInit();

      expect(roomService.query).toHaveBeenCalled();
      expect(roomService.addRoomToCollectionIfMissing).toHaveBeenCalledWith(
        roomCollection,
        ...additionalRooms.map(expect.objectContaining)
      );
      expect(comp.roomsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const deficit: IDeficit = { id: 456 };
      const room: IRoom = { id: 41651 };
      deficit.room = room;

      activatedRoute.data = of({ deficit });
      comp.ngOnInit();

      expect(comp.roomsSharedCollection).toContain(room);
      expect(comp.deficit).toEqual(deficit);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDeficit>>();
      const deficit = { id: 123 };
      jest.spyOn(deficitFormService, 'getDeficit').mockReturnValue(deficit);
      jest.spyOn(deficitService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ deficit });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: deficit }));
      saveSubject.complete();

      // THEN
      expect(deficitFormService.getDeficit).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(deficitService.update).toHaveBeenCalledWith(expect.objectContaining(deficit));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDeficit>>();
      const deficit = { id: 123 };
      jest.spyOn(deficitFormService, 'getDeficit').mockReturnValue({ id: null });
      jest.spyOn(deficitService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ deficit: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: deficit }));
      saveSubject.complete();

      // THEN
      expect(deficitFormService.getDeficit).toHaveBeenCalled();
      expect(deficitService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDeficit>>();
      const deficit = { id: 123 };
      jest.spyOn(deficitService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ deficit });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(deficitService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareRoom', () => {
      it('Should forward to roomService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(roomService, 'compareRoom');
        comp.compareRoom(entity, entity2);
        expect(roomService.compareRoom).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
