import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { WorkPackageService } from '../service/work-package.service';

import { WorkPackageComponent } from './work-package.component';

describe('WorkPackage Management Component', () => {
  let comp: WorkPackageComponent;
  let fixture: ComponentFixture<WorkPackageComponent>;
  let service: WorkPackageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'work-package', component: WorkPackageComponent }]), HttpClientTestingModule],
      declarations: [WorkPackageComponent],
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
      .overrideTemplate(WorkPackageComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(WorkPackageComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(WorkPackageService);

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
    expect(comp.workPackages?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to workPackageService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getWorkPackageIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getWorkPackageIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
