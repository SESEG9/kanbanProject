import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { RoomDetailComponent } from './room-detail.component';

describe('Room Management Detail Component', () => {
  let comp: RoomDetailComponent;
  let fixture: ComponentFixture<RoomDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RoomDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ room: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(RoomDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(RoomDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load room on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.room).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
