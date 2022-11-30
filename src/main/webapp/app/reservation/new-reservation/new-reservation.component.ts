import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { rooms } from 'app/app.constants';
import { map } from 'rxjs';

@Component({
  selector: 'jhi-new-reservation',
  templateUrl: './new-reservation.component.html',
  styleUrls: ['./new-reservation.component.scss']
})
export class NewReservationComponent implements OnInit {
  rooms = rooms;
  room: any;

  error = false
  success = false
  vacationDate = false

  promo: string | null = null

  form = new FormGroup({
    firstName: new FormControl("", [Validators.required]),
    lastName: new FormControl("", [Validators.required]),
    email: new FormControl("", [Validators.email, Validators.required]),
    birthdate: new FormControl(new Date(), [Validators.required]),
    gender: new FormControl("", [Validators.required]),
    tel: new FormControl("", [Validators.required]),
    vacationStart: new FormControl(new Date(), [Validators.required]),
    vacationEnd: new FormControl(new Date(), [Validators.required]),
    room: new FormControl("", [Validators.required]),
  })

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    this.route.paramMap.pipe(map(() => window.history.state.promo)).subscribe(data => this.promo = data === undefined ? null : data)
    const id = this.route.snapshot.params['id'];
    // eslint-disable-next-line eqeqeq
    this.room = this.rooms.filter((_room: any) => _room.id == id)[0]
    if (this.room) {
      this.form.get('room')?.setValue(this.room.id)
    }
  }

  reserve(): void {
    this.error = false
    this.vacationDate = false
    this.success = false

    this.success = true
  }


}
