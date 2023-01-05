import { Component, OnInit } from '@angular/core';
import { VacationApply, VacationApplyUser } from '../vacation.model';
import { VacationDateService } from '../service/vacation-date.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'jhi-vacation-apply-check',
  templateUrl: './vacation-apply-check.component.html',
  styleUrls: ['./vacation-apply-check.component.scss', '../../room/room.global.scss'],
})
export class VacationApplyCheckComponent implements OnInit {
  user = {
    firstName: 'Hans',
    lastName: 'Meier',
    area: 'Administration',
    freeVacation: 10,
  };

  vacation: VacationApply;

  overlappings: VacationApplyUser[] = [];

  param: any = 0;

  constructor(public vacationDateService: VacationDateService, private route: ActivatedRoute) {
    this.vacation = {
      from: new Date('2023-02-01'),
      to: new Date('2023-02-04'),
      state: 'APPLIED',
    };
  }

  ngOnInit(): void {
    this.route.params.subscribe(param => (this.param = +param.id));
    // TODO use this parameter to load the data from the backend

    this.overlappings = [
      {
        from: new Date('2023-02-01'),
        to: new Date('2023-02-04'),
        state: 'APPLIED',
        id: 15,
        user: {
          firstName: 'Jürgen',
          lastName: 'Müller',
          area: 'Rezeption',
          freeVacation: 10,
        },
      },
      {
        from: new Date('2023-02-01'),
        to: new Date('2023-02-15'),
        state: 'APPLIED',
        id: 15,
        user: {
          firstName: 'Sandra',
          lastName: 'Kegler',
          area: 'Technik',
          freeVacation: 10,
        },
      },
      {
        from: new Date('2023-01-30'),
        to: new Date('2023-02-06'),
        state: 'APPLIED',
        id: 15,
        user: {
          firstName: 'Anja',
          lastName: 'Löwe',
          area: 'Rezeption',
          freeVacation: 10,
        },
      },
      {
        from: new Date('2023-01-25'),
        to: new Date('2023-02-01'),
        state: 'APPLIED',
        id: 15,
        user: {
          firstName: 'Annemarie',
          lastName: 'Stöger',
          area: 'Cleaning',
          freeVacation: 10,
        },
      },
    ];
  }
}
