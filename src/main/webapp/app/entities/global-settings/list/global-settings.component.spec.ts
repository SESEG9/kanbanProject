import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { GlobalSettingsService } from '../service/global-settings.service';

import { GlobalSettingsComponent } from './global-settings.component';

describe('GlobalSettings Management Component', () => {
  let comp: GlobalSettingsComponent;
  let fixture: ComponentFixture<GlobalSettingsComponent>;
  let service: GlobalSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'global-settings', component: GlobalSettingsComponent }]), HttpClientTestingModule],
      declarations: [GlobalSettingsComponent],
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
      .overrideTemplate(GlobalSettingsComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(GlobalSettingsComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(GlobalSettingsService);

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
    expect(comp.globalSettings?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to globalSettingsService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getGlobalSettingsIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getGlobalSettingsIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
