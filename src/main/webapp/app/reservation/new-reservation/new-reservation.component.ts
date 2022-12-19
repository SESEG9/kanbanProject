import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { EntityArrayResponseType } from 'app/entities/customer/service/customer.service';
import { DiscountService } from 'app/entities/discount/service/discount.service';
import { IDiscount } from 'app/entities/discount/type/discount';
import { RoomPictureService } from 'app/entities/room-picture/service/room-picture.service';
import { IRoom, RoomPicture, RoomPrice } from 'app/entities/room/room.model';
import { RoomService } from 'app/entities/room/service/room.service';
import { SortService } from 'app/shared/sort/sort.service';
import { map } from 'rxjs';
import { Reservation, ReservationResponse } from '../reservation.model';
import { ReservationService } from '../reservation.service';


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

  discountMultiplier = 1

  predicate = 'id';
  ascending = true;

  error = false;
  errorMessage = ''
  discountError = false
  discountErrorMessage = ''
  success = false;

  promo: string | null = null;

  reservation?: ReservationResponse

  form = new FormGroup({
    billingCustomer: new FormGroup({
        firstName: new FormControl('', [Validators.required]),
        lastName: new FormControl('', [Validators.required]),
        email: new FormControl('', [Validators.email, Validators.required]),
        birthday: new FormControl(new Date(), [Validators.required]),
        gender: new FormControl('', [Validators.required]),
        telephone: new FormControl('', [Validators.required]),
        billingAddress: new FormControl('', [Validators.required])
    }),
    customers: new FormArray([]),
    vacationStart: new FormControl(new Date(), [Validators.required]),
    vacationEnd: new FormControl(new Date(), [Validators.required]),
    rooms: new FormArray([
      new FormGroup({
          roomID: new FormControl('', [Validators.required]),
          capacityID: new FormControl('', [Validators.required])
      })
    ]),
    discountCode: new FormControl("")
  });

  constructor(
    private route: ActivatedRoute,
    private $roomService: RoomService,
    private $roomPictureService: RoomPictureService,
    protected $sortService: SortService,
    private $reservationService: ReservationService,
    private $discountService: DiscountService
  ) {}

  ngOnInit(): void {
    this.$roomService.query().subscribe({
      next: (res: EntityArrayResponseType) => {
        this.onResponseSuccess(res);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        this.route.paramMap.pipe(map(() => window.history.state.roomID)).subscribe(data => (this.roomsFormControl.at(0).get('roomID')?.setValue(data === undefined ? null : data)));
      },
    })
  }

  dateDiffInDays(a: Date, b: Date): number {
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;
    // Discard the time and time-zone information.
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

    return Math.floor((utc2 - utc1) / _MS_PER_DAY);
  }
  getEndDate(date: string, duration: number): string {
    const endDate = new Date(date)
    endDate.setDate(endDate.getDate() + duration)
    return formatDate(endDate, 'dd.MM.yyyy', 'en-US')
  }

  createReservation(): void {
    this.form.markAllAsTouched()
    if (this.form.valid) {
      const reservation: any = this.form.value
      reservation.duration = this.dateDiffInDays(new Date(reservation.vacationStart), new Date(reservation.vacationEnd))
      if (reservation.duration >= 1) {
        reservation.duration = this.dateDiffInDays(new Date(reservation.vacationStart), new Date(reservation.vacationEnd))
        reservation.startDate = reservation.vacationStart
        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
        reservation.billingCustomer.name = reservation.billingCustomer.firstName + " " + reservation.billingCustomer.lastName
        delete reservation.billingCustomer.firstName
        delete reservation.billingCustomer.lastName
        for (let i = 0; i < reservation.customers.length; i++) {
          // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
          reservation.customers[i].name = reservation.customers[i].firstName + " " + reservation.customers[i].lastName
          delete reservation.customers[i].firstName
          delete reservation.customers[i].lastName
        }
        delete reservation.vacationStart
        delete reservation.vacationEnd
        if (this.discountMultiplier === 1) {
          delete reservation.discountCode
        }
        this.$reservationService.create(reservation as Reservation).subscribe({
          next: (value) => {
            this.reservation = value
            this.success = true
            this.error = false
          },
          error: (error) => {
            this.error = true
            this.errorMessage = error.error.title
          }
        })
      } else {
        this.error = true
        this.errorMessage = 'Enddatum muss nach dem Startdatum liegen.'
      }
    }
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
      roomID: new FormControl('', [Validators.required]),
      capacityID: new FormControl('', [Validators.required])
    }))
  }
  removeRoomRow(index: number) : void {
    this.roomsFormControl.removeAt(index)
  }
  addPersonRow(): void {
    this.customerFormControl.push(
      new FormGroup({
        firstName: new FormControl('', [Validators.required]),
        lastName: new FormControl('', [Validators.required]),
        email: new FormControl('', [Validators.email, Validators.required]),
        birthday: new FormControl(new Date(), [Validators.required]),
        gender: new FormControl('', [Validators.required]),
        telephone: new FormControl('', [Validators.required]),
        billingAddress: new FormControl('', [Validators.required])
      })
    )
  }
  removePersonRow(index: number) : void {
    this.customerFormControl.removeAt(index)
  }


  protected onResponseSuccess(response: EntityArrayResponseType): void {
    const dataFromBody = this.fillComponentAttributesFromResponseBody(response.body);
    this.rooms = this.refineData(dataFromBody)
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
  getPriceByCapacityID(room: IRoom, capacityID: number) : number {
    // eslint-disable-next-line eqeqeq
    const price = room.prices?.find((roomPrice: RoomPrice) => roomPrice.capacity?.id == capacityID)?.price ?? 0
    return price / 100
  }
  getCountDays(): number {
    return this.dateDiffInDays(new Date(this.form.controls['vacationStart'].value!), new Date(this.form.controls['vacationEnd'].value!))
  }
  getSum(rooms: [{roomID: number, capacityID: number}]) : number {
    let sum = 0;
    rooms.forEach((room) => {
      sum += this.getCountDays() * this.getPriceByCapacityID(this.getRoomById(room.roomID), room.capacityID)
    })
    if (this.discountMultiplier !== 1) {
      sum *= this.discountMultiplier
    }
    return sum
  }
  getTempSum(rooms: [{roomID: number, capacityID: number}]) : number {
    let sum = 0;
    rooms.forEach((room) => {
      sum += this.getCountDays() * this.getPriceByCapacityID(this.getRoomById(room.roomID), room.capacityID)
    })
    return sum
  }
  getDiscount(rooms: [{roomID: number, capacityID: number}]) : number {
    let sum = 0;
    rooms.forEach((room) => {
      sum += this.getCountDays() * this.getPriceByCapacityID(this.getRoomById(room.roomID), room.capacityID)
    })
    return sum - (sum * this.discountMultiplier)
  }

  checkDiscount(): void {
    this.$discountService.check(this.form.controls['discountCode'].value!).subscribe({
      next: (discount: IDiscount) => {
        this.discountMultiplier = (100 - discount.discountPercentage) / 100
        this.discountError = false
      },
      error: (error) => {
        this.discountError = true
        this.discountErrorMessage = "Rabattcode ungültig"
      }
    })
  }


}
