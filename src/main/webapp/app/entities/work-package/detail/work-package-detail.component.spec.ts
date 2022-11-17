import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { WorkPackageDetailComponent } from './work-package-detail.component';

describe('WorkPackage Management Detail Component', () => {
  let comp: WorkPackageDetailComponent;
  let fixture: ComponentFixture<WorkPackageDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WorkPackageDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ workPackage: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(WorkPackageDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(WorkPackageDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load workPackage on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.workPackage).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
