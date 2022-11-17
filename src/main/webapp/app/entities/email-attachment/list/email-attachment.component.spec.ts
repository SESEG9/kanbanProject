import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { EmailAttachmentService } from '../service/email-attachment.service';

import { EmailAttachmentComponent } from './email-attachment.component';

describe('EmailAttachment Management Component', () => {
  let comp: EmailAttachmentComponent;
  let fixture: ComponentFixture<EmailAttachmentComponent>;
  let service: EmailAttachmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'email-attachment', component: EmailAttachmentComponent }]),
        HttpClientTestingModule,
      ],
      declarations: [EmailAttachmentComponent],
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
      .overrideTemplate(EmailAttachmentComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EmailAttachmentComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(EmailAttachmentService);

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
    expect(comp.emailAttachments?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to emailAttachmentService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getEmailAttachmentIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getEmailAttachmentIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
