import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { rooms } from 'app/app.constants';

@Component({
  selector: 'jhi-home',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.scss'],
})
export class RoomsComponent {
  rooms = rooms;

  constructor(private router: Router) {}
}
