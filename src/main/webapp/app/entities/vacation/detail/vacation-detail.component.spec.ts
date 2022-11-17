import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { VacationDetailComponent } from './vacation-detail.component';

describe('Vacation Management Detail Component', () => {
  let comp: VacationDetailComponent;
  let fixture: ComponentFixture<VacationDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VacationDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ vacation: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(VacationDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(VacationDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load vacation on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.vacation).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
