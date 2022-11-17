import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { HumanResourceDetailComponent } from './human-resource-detail.component';

describe('HumanResource Management Detail Component', () => {
  let comp: HumanResourceDetailComponent;
  let fixture: ComponentFixture<HumanResourceDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HumanResourceDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ humanResource: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(HumanResourceDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(HumanResourceDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load humanResource on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.humanResource).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
