import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { EntityArrayResponseType } from 'app/entities/customer/service/customer.service';
import { RoomPictureService } from 'app/entities/room-picture/service/room-picture.service';
import { IRoom, RoomPicture, RoomPrice } from 'app/entities/room/room.model';
import { RoomService } from 'app/entities/room/service/room.service';
import { SortService } from 'app/shared/sort/sort.service';
import { map } from 'rxjs';


interface IRoomWithMinPrice extends IRoom {
  minPrice?: number | null;
  picture?: RoomPicture | null;
}
@Component({
  selector: 'jhi-new-reservation',
  templateUrl: './new-reservation.component.html',
  styleUrls: ['./new-reservation.component.scss'],
})
export class NewReservationComponent implements OnInit {
  rooms?: IRoomWithMinPrice[];
  room: any;

  predicate = 'id';
  ascending = true;

  error = false;
  success = false;
  vacationDate = false;

  promo: string | null = null;

  form = new FormGroup({
    billingCustomer: new FormGroup({
        firstName: new FormControl('', [Validators.required]),
        lastName: new FormControl('', [Validators.required]),
        email: new FormControl('', [Validators.email, Validators.required]),
        birthdate: new FormControl(new Date(), [Validators.required]),
        gender: new FormControl('', [Validators.required]),
        tel: new FormControl('', [Validators.required]),
        address: new FormControl('', [Validators.required])
    }),
    customers: new FormArray([]),
    vacationStart: new FormControl(new Date(), [Validators.required]),
    vacationEnd: new FormControl(new Date(), [Validators.required]),
    rooms: new FormArray([
      new FormGroup({
          room: new FormControl('', [Validators.required]),
          countPersons: new FormControl('', [Validators.required])
      })
    ])
  });

  constructor(
    private route: ActivatedRoute,
    private $roomService: RoomService,
    private $roomPictureService: RoomPictureService,
    protected $sortService: SortService,
  ) {}

  ngOnInit(): void {
    this.$roomService.query().subscribe({
      next: (res: EntityArrayResponseType) => {
        this.onResponseSuccess(res);
      },
    })


    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    this.route.paramMap.pipe(map(() => window.history.state.promo)).subscribe(data => (this.promo = data === undefined ? null : data));
    const id = this.route.snapshot.params['id'];
    // eslint-disable-next-line eqeqeq
    // this.room = this.rooms.filter((_room: any) => _room.id == id)[0];
    // if (this.room) {
    //   this.form.get('room')?.setValue(this.room.id);
    // }
  }

  createReservation(): void {
    this.form.markAllAsTouched()
    // if (this.form.valid) {

    // }
    this.error = false;
    this.vacationDate = false;
    this.success = false;

    this.success = true;
  }

  get roomsFormControl(): FormArray {
    return this.form.controls['rooms'] as FormArray
  }
  get customerFormControl(): FormArray {
    return this.form.controls['customers'] as any as FormArray
  }

  addRoomRow(): void {
    this.roomsFormControl.push(
      new FormGroup({
      room: new FormControl('', [Validators.required]),
      countPersons: new FormControl('', [Validators.required])
    }))
  }
  addPersonRow(): void {
    this.customerFormControl.push(
      new FormGroup({
        firstName: new FormControl('', [Validators.required]),
        lastName: new FormControl('', [Validators.required]),
        email: new FormControl('', [Validators.email, Validators.required]),
        birthdate: new FormControl(new Date(), [Validators.required]),
        gender: new FormControl('', [Validators.required]),
        tel: new FormControl('', [Validators.required]),
        address: new FormControl('', [Validators.required])
      })
    )
  }


  protected onResponseSuccess(response: EntityArrayResponseType): void {
    const dataFromBody = this.fillComponentAttributesFromResponseBody(response.body);
    this.rooms = this.refineData(dataFromBody)
    // eslint-disable-next-line no-console
    console.log(this.rooms)
  }
  protected fillComponentAttributesFromResponseBody(data: IRoomWithMinPrice[] | null): IRoomWithMinPrice[] {
    const responseRooms = data ?? [];
    responseRooms.forEach(r => {
      r.minPrice = this.getMinPrice(r.prices);
      if (r.pictureIDs && r.pictureIDs.length > 0) {
        this.$roomPictureService.find(r.pictureIDs[0]).subscribe({ next: next => (r.picture = next.body) });
      }
    });
    return responseRooms;
  }
  getMinPrice(prices: RoomPrice[] | null | undefined): number | null {
    if (!prices || prices.length < 1) {
      return null;
    }
    return Math.min(...prices.map(p => p.price)) / 100;
  }
  protected refineData(data: IRoom[]): IRoom[] {
    return data.sort(this.$sortService.startSort(this.predicate, this.ascending ? 1 : -1));
  }

  getRoomById(roomId: number): IRoom {
    // eslint-disable-next-line eqeqeq
    return this.rooms?.filter((room: IRoom) => room.id == roomId)[0] ?? {} as IRoom
  }
}
