import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { HumanResourceService } from '../service/human-resource.service';

import { HumanResourceComponent } from './human-resource.component';

describe('HumanResource Management Component', () => {
  let comp: HumanResourceComponent;
  let fixture: ComponentFixture<HumanResourceComponent>;
  let service: HumanResourceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'human-resource', component: HumanResourceComponent }]), HttpClientTestingModule],
      declarations: [HumanResourceComponent],
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
      .overrideTemplate(HumanResourceComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(HumanResourceComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(HumanResourceService);

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
    expect(comp.humanResources?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to humanResourceService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getHumanResourceIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getHumanResourceIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
