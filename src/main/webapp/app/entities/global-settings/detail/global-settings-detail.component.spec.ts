import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { GlobalSettingsDetailComponent } from './global-settings-detail.component';

describe('GlobalSettings Management Detail Component', () => {
  let comp: GlobalSettingsDetailComponent;
  let fixture: ComponentFixture<GlobalSettingsDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GlobalSettingsDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ globalSettings: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(GlobalSettingsDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(GlobalSettingsDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load globalSettings on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.globalSettings).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
