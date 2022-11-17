jest.mock('@ng-bootstrap/ng-bootstrap');

import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { BulkLetterTemplateService } from '../service/bulk-letter-template.service';

import { BulkLetterTemplateDeleteDialogComponent } from './bulk-letter-template-delete-dialog.component';

describe('BulkLetterTemplate Management Delete Component', () => {
  let comp: BulkLetterTemplateDeleteDialogComponent;
  let fixture: ComponentFixture<BulkLetterTemplateDeleteDialogComponent>;
  let service: BulkLetterTemplateService;
  let mockActiveModal: NgbActiveModal;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [BulkLetterTemplateDeleteDialogComponent],
      providers: [NgbActiveModal],
    })
      .overrideTemplate(BulkLetterTemplateDeleteDialogComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(BulkLetterTemplateDeleteDialogComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(BulkLetterTemplateService);
    mockActiveModal = TestBed.inject(NgbActiveModal);
  });

  describe('confirmDelete', () => {
    it('Should call delete service on confirmDelete', inject(
      [],
      fakeAsync(() => {
        // GIVEN
        jest.spyOn(service, 'delete').mockReturnValue(of(new HttpResponse({ body: {} })));

        // WHEN
        comp.confirmDelete(123);
        tick();

        // THEN
        expect(service.delete).toHaveBeenCalledWith(123);
        expect(mockActiveModal.close).toHaveBeenCalledWith('deleted');
      })
    ));

    it('Should not call delete service on clear', () => {
      // GIVEN
      jest.spyOn(service, 'delete');

      // WHEN
      comp.cancel();

      // THEN
      expect(service.delete).not.toHaveBeenCalled();
      expect(mockActiveModal.close).not.toHaveBeenCalled();
      expect(mockActiveModal.dismiss).toHaveBeenCalled();
    });
  });
});
