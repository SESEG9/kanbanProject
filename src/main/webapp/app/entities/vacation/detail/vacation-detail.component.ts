import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IVacation } from '../vacation.model';

@Component({
  selector: 'jhi-vacation-detail',
  templateUrl: './vacation-detail.component.html',
})
export class VacationDetailComponent implements OnInit {
  vacation: IVacation | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ vacation }) => {
      this.vacation = vacation;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
