import { Component, OnInit } from '@angular/core';
import { NgbCalendar, NgbDate, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { faCalendarDays } from '@fortawesome/free-solid-svg-icons';

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

  ngOnInit(): void {}

  onDateSelection(date: NgbDate) {
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

  updateChosenDays() {
    if (this.fromDate && this.toDate) {
      const fromDateJs = new Date(this.fromDate.year, this.fromDate.month - 1, this.fromDate.day);
      const toDateJs = new Date(this.toDate.year, this.toDate.month - 1, this.toDate.day);
      this.choosenDays = VacationApplyCreateComponent.datediff(fromDateJs, toDateJs) + 1;
    }
  }

  private static datediff(first: Date, second: Date) {
    return Math.round((second.getTime() - first.getTime()) / (1000 * 60 * 60 * 24));
  }

  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || (this.toDate && date.equals(this.toDate)) || this.isInside(date) || this.isHovered(date);
  }

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
  }

  applyVacation() {}
}
