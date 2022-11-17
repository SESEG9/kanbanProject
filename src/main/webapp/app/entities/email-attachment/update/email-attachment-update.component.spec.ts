import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { EmailAttachmentFormService } from './email-attachment-form.service';
import { EmailAttachmentService } from '../service/email-attachment.service';
import { IEmailAttachment } from '../email-attachment.model';
import { IBulkLetterTemplate } from 'app/entities/bulk-letter-template/bulk-letter-template.model';
import { BulkLetterTemplateService } from 'app/entities/bulk-letter-template/service/bulk-letter-template.service';

import { EmailAttachmentUpdateComponent } from './email-attachment-update.component';

describe('EmailAttachment Management Update Component', () => {
  let comp: EmailAttachmentUpdateComponent;
  let fixture: ComponentFixture<EmailAttachmentUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let emailAttachmentFormService: EmailAttachmentFormService;
  let emailAttachmentService: EmailAttachmentService;
  let bulkLetterTemplateService: BulkLetterTemplateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [EmailAttachmentUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(EmailAttachmentUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EmailAttachmentUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    emailAttachmentFormService = TestBed.inject(EmailAttachmentFormService);
    emailAttachmentService = TestBed.inject(EmailAttachmentService);
    bulkLetterTemplateService = TestBed.inject(BulkLetterTemplateService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call BulkLetterTemplate query and add missing value', () => {
      const emailAttachment: IEmailAttachment = { id: 456 };
      const bulkLetterTemplate: IBulkLetterTemplate = { id: 79979 };
      emailAttachment.bulkLetterTemplate = bulkLetterTemplate;

      const bulkLetterTemplateCollection: IBulkLetterTemplate[] = [{ id: 36004 }];
      jest.spyOn(bulkLetterTemplateService, 'query').mockReturnValue(of(new HttpResponse({ body: bulkLetterTemplateCollection })));
      const additionalBulkLetterTemplates = [bulkLetterTemplate];
      const expectedCollection: IBulkLetterTemplate[] = [...additionalBulkLetterTemplates, ...bulkLetterTemplateCollection];
      jest.spyOn(bulkLetterTemplateService, 'addBulkLetterTemplateToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ emailAttachment });
      comp.ngOnInit();

      expect(bulkLetterTemplateService.query).toHaveBeenCalled();
      expect(bulkLetterTemplateService.addBulkLetterTemplateToCollectionIfMissing).toHaveBeenCalledWith(
        bulkLetterTemplateCollection,
        ...additionalBulkLetterTemplates.map(expect.objectContaining)
      );
      expect(comp.bulkLetterTemplatesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const emailAttachment: IEmailAttachment = { id: 456 };
      const bulkLetterTemplate: IBulkLetterTemplate = { id: 17641 };
      emailAttachment.bulkLetterTemplate = bulkLetterTemplate;

      activatedRoute.data = of({ emailAttachment });
      comp.ngOnInit();

      expect(comp.bulkLetterTemplatesSharedCollection).toContain(bulkLetterTemplate);
      expect(comp.emailAttachment).toEqual(emailAttachment);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEmailAttachment>>();
      const emailAttachment = { id: 123 };
      jest.spyOn(emailAttachmentFormService, 'getEmailAttachment').mockReturnValue(emailAttachment);
      jest.spyOn(emailAttachmentService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ emailAttachment });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: emailAttachment }));
      saveSubject.complete();

      // THEN
      expect(emailAttachmentFormService.getEmailAttachment).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(emailAttachmentService.update).toHaveBeenCalledWith(expect.objectContaining(emailAttachment));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEmailAttachment>>();
      const emailAttachment = { id: 123 };
      jest.spyOn(emailAttachmentFormService, 'getEmailAttachment').mockReturnValue({ id: null });
      jest.spyOn(emailAttachmentService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ emailAttachment: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: emailAttachment }));
      saveSubject.complete();

      // THEN
      expect(emailAttachmentFormService.getEmailAttachment).toHaveBeenCalled();
      expect(emailAttachmentService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEmailAttachment>>();
      const emailAttachment = { id: 123 };
      jest.spyOn(emailAttachmentService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ emailAttachment });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(emailAttachmentService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareBulkLetterTemplate', () => {
      it('Should forward to bulkLetterTemplateService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(bulkLetterTemplateService, 'compareBulkLetterTemplate');
        comp.compareBulkLetterTemplate(entity, entity2);
        expect(bulkLetterTemplateService.compareBulkLetterTemplate).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
