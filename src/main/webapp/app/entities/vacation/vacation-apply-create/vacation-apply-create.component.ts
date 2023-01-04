import { Component, OnInit } from '@angular/core';
import { NgbCalendar, NgbDate, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import * as FontAwesome from '@fortawesome/free-solid-svg-icons';
import { VacationApply } from '../vacation.model';

@Component({
  selector: 'jhi-vacation-apply-create',
  templateUrl: './vacation-apply-create.component.html',
  styleUrls: ['./vacation-apply-create.component.scss', '../../room/room.global.scss'],
})
export class VacationApplyCreateComponent implements OnInit {
  public isCollapsed = false;

  hoveredDate: NgbDate | null = null;

  fromDate: NgbDate | null;
  toDate: NgbDate | null;

  availableVacation = 0;

  choosenDays: number | null;

  faCalendarIcon = FontAwesome.faCalendarDays;
  faQuestionIcon = FontAwesome.faQuestion;
  faCheckmarkIcon = FontAwesome.faCheck;
  faCrossIcon = FontAwesome.faXmark;

  vacations: VacationApply[] = [];

  year = new Date().getFullYear();

  constructor(private calendar: NgbCalendar, public formatter: NgbDateParserFormatter) {
    this.fromDate = null;
    this.toDate = null;
    this.choosenDays = null;
  }

  ngOnInit(): void {
    // TODO query for free days and current lists
    this.availableVacation = 10;
    this.loadVacations();
  }

  onDateSelection(date: NgbDate): void {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
      this.updateChosenDays();
    } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
      this.toDate = date;
      this.updateChosenDays();
    } else {
      this.toDate = null;
      this.fromDate = date;
      this.updateChosenDays();
    }
  }

  updateChosenDays(): void {
    if (this.fromDate && this.toDate) {
      const fromDateJs = VacationApplyCreateComponent.ngbDateToJsDate(this.fromDate);
      const toDateJs = VacationApplyCreateComponent.ngbDateToJsDate(this.toDate);
      this.choosenDays = this.datediff(fromDateJs, toDateJs);
    }
  }

  datediff(first: Date, second: Date): number {
    return Math.round((second.getTime() - first.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  }

  static ngbDateToJsDate(ngbDate: NgbDate): Date {
    return new Date(ngbDate.year, ngbDate.month - 1, ngbDate.day);
  }

  isHovered(date: NgbDate): boolean | null {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate): boolean | null {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate): boolean | null {
    return date.equals(this.fromDate) || (this.toDate && date.equals(this.toDate)) || this.isInside(date) || this.isHovered(date);
  }

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
  }

  applyVacation(): void {
    if (this.fromDate && this.toDate) {
      const vacationApply: VacationApply = {
        from: VacationApplyCreateComponent.ngbDateToJsDate(this.fromDate),
        to: VacationApplyCreateComponent.ngbDateToJsDate(this.toDate),
        state: 'APPLIED',
      };
    }
  }

  loadVacations(): void {
    this.vacations = [
      {
        from: new Date('2023-01-01'),
        to: new Date('2023-01-05'),
        state: 'APPROVED',
      },
      {
        from: new Date('2023-01-17'),
        to: new Date('2023-01-23'),
        state: 'APPROVED',
      },
      {
        from: new Date('2023-02-01'),
        to: new Date('2023-02-14'),
        state: 'REJECTED',
      },
      {
        from: new Date('2023-03-15'),
        to: new Date('2023-03-18'),
        state: 'APPLIED',
      },
      {
        from: new Date('2023-05-21'),
        to: new Date('2023-06-03'),
        state: 'APPLIED',
      },
    ];
  }
}
