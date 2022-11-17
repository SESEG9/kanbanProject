import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { RoomPriceFormService } from './room-price-form.service';
import { RoomPriceService } from '../service/room-price.service';
import { IRoomPrice } from '../room-price.model';
import { IRoomCapacity } from 'app/entities/room-capacity/room-capacity.model';
import { RoomCapacityService } from 'app/entities/room-capacity/service/room-capacity.service';
import { IRoom } from 'app/entities/room/room.model';
import { RoomService } from 'app/entities/room/service/room.service';

import { RoomPriceUpdateComponent } from './room-price-update.component';

describe('RoomPrice Management Update Component', () => {
  let comp: RoomPriceUpdateComponent;
  let fixture: ComponentFixture<RoomPriceUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let roomPriceFormService: RoomPriceFormService;
  let roomPriceService: RoomPriceService;
  let roomCapacityService: RoomCapacityService;
  let roomService: RoomService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [RoomPriceUpdateComponent],
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
      .overrideTemplate(RoomPriceUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(RoomPriceUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    roomPriceFormService = TestBed.inject(RoomPriceFormService);
    roomPriceService = TestBed.inject(RoomPriceService);
    roomCapacityService = TestBed.inject(RoomCapacityService);
    roomService = TestBed.inject(RoomService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call RoomCapacity query and add missing value', () => {
      const roomPrice: IRoomPrice = { id: 456 };
      const capacity: IRoomCapacity = { id: 77576 };
      roomPrice.capacity = capacity;

      const roomCapacityCollection: IRoomCapacity[] = [{ id: 5656 }];
      jest.spyOn(roomCapacityService, 'query').mockReturnValue(of(new HttpResponse({ body: roomCapacityCollection })));
      const additionalRoomCapacities = [capacity];
      const expectedCollection: IRoomCapacity[] = [...additionalRoomCapacities, ...roomCapacityCollection];
      jest.spyOn(roomCapacityService, 'addRoomCapacityToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ roomPrice });
      comp.ngOnInit();

      expect(roomCapacityService.query).toHaveBeenCalled();
      expect(roomCapacityService.addRoomCapacityToCollectionIfMissing).toHaveBeenCalledWith(
        roomCapacityCollection,
        ...additionalRoomCapacities.map(expect.objectContaining)
      );
      expect(comp.roomCapacitiesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Room query and add missing value', () => {
      const roomPrice: IRoomPrice = { id: 456 };
      const room: IRoom = { id: 27882 };
      roomPrice.room = room;

      const roomCollection: IRoom[] = [{ id: 68250 }];
      jest.spyOn(roomService, 'query').mockReturnValue(of(new HttpResponse({ body: roomCollection })));
      const additionalRooms = [room];
      const expectedCollection: IRoom[] = [...additionalRooms, ...roomCollection];
      jest.spyOn(roomService, 'addRoomToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ roomPrice });
      comp.ngOnInit();

      expect(roomService.query).toHaveBeenCalled();
      expect(roomService.addRoomToCollectionIfMissing).toHaveBeenCalledWith(
        roomCollection,
        ...additionalRooms.map(expect.objectContaining)
      );
      expect(comp.roomsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const roomPrice: IRoomPrice = { id: 456 };
      const capacity: IRoomCapacity = { id: 26761 };
      roomPrice.capacity = capacity;
      const room: IRoom = { id: 18245 };
      roomPrice.room = room;

      activatedRoute.data = of({ roomPrice });
      comp.ngOnInit();

      expect(comp.roomCapacitiesSharedCollection).toContain(capacity);
      expect(comp.roomsSharedCollection).toContain(room);
      expect(comp.roomPrice).toEqual(roomPrice);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IRoomPrice>>();
      const roomPrice = { id: 123 };
      jest.spyOn(roomPriceFormService, 'getRoomPrice').mockReturnValue(roomPrice);
      jest.spyOn(roomPriceService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ roomPrice });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: roomPrice }));
      saveSubject.complete();

      // THEN
      expect(roomPriceFormService.getRoomPrice).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(roomPriceService.update).toHaveBeenCalledWith(expect.objectContaining(roomPrice));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IRoomPrice>>();
      const roomPrice = { id: 123 };
      jest.spyOn(roomPriceFormService, 'getRoomPrice').mockReturnValue({ id: null });
      jest.spyOn(roomPriceService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ roomPrice: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: roomPrice }));
      saveSubject.complete();

      // THEN
      expect(roomPriceFormService.getRoomPrice).toHaveBeenCalled();
      expect(roomPriceService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IRoomPrice>>();
      const roomPrice = { id: 123 };
      jest.spyOn(roomPriceService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ roomPrice });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(roomPriceService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareRoomCapacity', () => {
      it('Should forward to roomCapacityService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(roomCapacityService, 'compareRoomCapacity');
        comp.compareRoomCapacity(entity, entity2);
        expect(roomCapacityService.compareRoomCapacity).toHaveBeenCalledWith(entity, entity2);
      });
    });

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
