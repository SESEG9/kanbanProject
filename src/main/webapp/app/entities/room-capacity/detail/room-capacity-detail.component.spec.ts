import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { RoomCapacityDetailComponent } from './room-capacity-detail.component';

describe('RoomCapacity Management Detail Component', () => {
  let comp: RoomCapacityDetailComponent;
  let fixture: ComponentFixture<RoomCapacityDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RoomCapacityDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ roomCapacity: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(RoomCapacityDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(RoomCapacityDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load roomCapacity on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.roomCapacity).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
