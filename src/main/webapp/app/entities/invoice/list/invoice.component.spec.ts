import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { InvoiceService } from '../service/invoice.service';

import { InvoiceComponent } from './invoice.component';

describe('Invoice Management Component', () => {
  let comp: InvoiceComponent;
  let fixture: ComponentFixture<InvoiceComponent>;
  let service: InvoiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'invoice', component: InvoiceComponent }]), HttpClientTestingModule],
      declarations: [InvoiceComponent],
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
      .overrideTemplate(InvoiceComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(InvoiceComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(InvoiceService);

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
    expect(comp.invoices?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to invoiceService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getInvoiceIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getInvoiceIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
