import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { RoomPriceDetailComponent } from './room-price-detail.component';

describe('RoomPrice Management Detail Component', () => {
  let comp: RoomPriceDetailComponent;
  let fixture: ComponentFixture<RoomPriceDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RoomPriceDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ roomPrice: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(RoomPriceDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(RoomPriceDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load roomPrice on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.roomPrice).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
