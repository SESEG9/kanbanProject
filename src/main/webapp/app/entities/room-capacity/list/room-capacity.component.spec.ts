import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { RoomCapacityService } from '../service/room-capacity.service';

import { RoomCapacityComponent } from './room-capacity.component';

describe('RoomCapacity Management Component', () => {
  let comp: RoomCapacityComponent;
  let fixture: ComponentFixture<RoomCapacityComponent>;
  let service: RoomCapacityService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'room-capacity', component: RoomCapacityComponent }]), HttpClientTestingModule],
      declarations: [RoomCapacityComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              })
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(RoomCapacityComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(RoomCapacityComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(RoomCapacityService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.roomCapacities?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to roomCapacityService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getRoomCapacityIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getRoomCapacityIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
