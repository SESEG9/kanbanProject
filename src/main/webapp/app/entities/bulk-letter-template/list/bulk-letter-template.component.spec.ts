import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { BulkLetterTemplateService } from '../service/bulk-letter-template.service';

import { BulkLetterTemplateComponent } from './bulk-letter-template.component';

describe('BulkLetterTemplate Management Component', () => {
  let comp: BulkLetterTemplateComponent;
  let fixture: ComponentFixture<BulkLetterTemplateComponent>;
  let service: BulkLetterTemplateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'bulk-letter-template', component: BulkLetterTemplateComponent }]),
        HttpClientTestingModule,
      ],
      declarations: [BulkLetterTemplateComponent],
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
      .overrideTemplate(BulkLetterTemplateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(BulkLetterTemplateComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(BulkLetterTemplateService);

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
    expect(comp.bulkLetterTemplates?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to bulkLetterTemplateService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getBulkLetterTemplateIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getBulkLetterTemplateIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
