jest.mock('@ng-bootstrap/ng-bootstrap');

import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { BookingService } from '../service/booking.service';

import { BookingDeleteDialogComponent } from './booking-delete-dialog.component';

describe('Booking Management Delete Component', () => {
  let comp: BookingDeleteDialogComponent;
  let fixture: ComponentFixture<BookingDeleteDialogComponent>;
  let service: BookingService;
  let mockActiveModal: NgbActiveModal;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [BookingDeleteDialogComponent],
      providers: [NgbActiveModal],
    })
      .overrideTemplate(BookingDeleteDialogComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(BookingDeleteDialogComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(BookingService);
    mockActiveModal = TestBed.inject(NgbActiveModal);
  });

  describe('confirmDelete', () => {

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
