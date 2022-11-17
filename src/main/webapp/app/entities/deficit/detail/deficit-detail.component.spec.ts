import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { DeficitDetailComponent } from './deficit-detail.component';

describe('Deficit Management Detail Component', () => {
  let comp: DeficitDetailComponent;
  let fixture: ComponentFixture<DeficitDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeficitDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ deficit: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(DeficitDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(DeficitDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load deficit on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.deficit).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
