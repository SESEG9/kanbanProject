import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { BookingDetailComponent } from './booking-detail.component';

describe('Booking Management Detail Component', () => {
  let comp: BookingDetailComponent;
  let fixture: ComponentFixture<BookingDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BookingDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ booking: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(BookingDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(BookingDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load booking on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.booking).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
