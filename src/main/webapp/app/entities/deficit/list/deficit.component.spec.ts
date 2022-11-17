import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { DeficitService } from '../service/deficit.service';

import { DeficitComponent } from './deficit.component';

describe('Deficit Management Component', () => {
  let comp: DeficitComponent;
  let fixture: ComponentFixture<DeficitComponent>;
  let service: DeficitService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'deficit', component: DeficitComponent }]), HttpClientTestingModule],
      declarations: [DeficitComponent],
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
      .overrideTemplate(DeficitComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(DeficitComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(DeficitService);

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
    expect(comp.deficits?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to deficitService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getDeficitIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getDeficitIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
