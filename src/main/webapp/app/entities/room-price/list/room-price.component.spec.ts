import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { RoomPriceService } from '../service/room-price.service';

import { RoomPriceComponent } from './room-price.component';

describe('RoomPrice Management Component', () => {
  let comp: RoomPriceComponent;
  let fixture: ComponentFixture<RoomPriceComponent>;
  let service: RoomPriceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'room-price', component: RoomPriceComponent }]), HttpClientTestingModule],
      declarations: [RoomPriceComponent],
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
      .overrideTemplate(RoomPriceComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(RoomPriceComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(RoomPriceService);

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
    expect(comp.roomPrices?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to roomPriceService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getRoomPriceIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getRoomPriceIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
