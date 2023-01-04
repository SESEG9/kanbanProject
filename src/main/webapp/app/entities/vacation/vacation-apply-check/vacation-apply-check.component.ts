import { Component, OnInit } from '@angular/core';
import { VacationApply } from '../vacation.model';

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

  vacation: VacationApply = {
    from: new Date('2023-02-01'),
    to: new Date('2023-02-04'),
    state: 'APPLIED',
  };

  overlappings = [
    {
      from: new Date('2023-02-01'),
      to: new Date('2023-02-04'),
      state: 'APPLIED',
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
      user: {
        firstName: 'Annemarie',
        lastName: 'Stöger',
        area: 'Cleaning',
        freeVacation: 10,
      },
    },
  ];

  datediff(first: Date, second: Date): number {
    return Math.round((second.getTime() - first.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  }

  constructor() {}

  ngOnInit(): void {}
}
