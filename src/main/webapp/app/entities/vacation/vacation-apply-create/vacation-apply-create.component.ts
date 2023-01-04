import { Component, OnInit } from '@angular/core';
import { NgbCalendar, NgbDate, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { faCalendarDays } from '@fortawesome/free-solid-svg-icons';
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

  availableVacation: number = 10;

  choosenDays: number | null;

  faCalendarIcon = faCalendarDays;

  constructor(private calendar: NgbCalendar, public formatter: NgbDateParserFormatter) {
    this.fromDate = null;
    this.toDate = null;
    this.choosenDays = null;
  }

  ngOnInit(): void {
    // TODO query for free days and current lists
    console.log('TODO');
  }

  onDateSelection(date: NgbDate): void {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
      this.updateChosenDays();
    } else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
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
      this.choosenDays = VacationApplyCreateComponent.datediff(fromDateJs, toDateJs) + 1;
    }
  }

  private static datediff(first: Date, second: Date) {
    return Math.round((second.getTime() - first.getTime()) / (1000 * 60 * 60 * 24));
  }

  private static ngbDateToJsDate(ngbDate: NgbDate): Date {
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

  applyVacation() {
    if (this.fromDate && this.toDate) {
      const vacationApply: VacationApply = {
        from: VacationApplyCreateComponent.ngbDateToJsDate(this.fromDate),
        to: VacationApplyCreateComponent.ngbDateToJsDate(this.toDate),
        state: 'APPLIED',
      };
      console.log('send date ' + JSON.stringify(vacationApply));
    }
  }
}
