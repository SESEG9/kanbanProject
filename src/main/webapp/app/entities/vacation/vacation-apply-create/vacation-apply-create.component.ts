import { Component, OnInit } from '@angular/core';
import { NgbCalendar, NgbDate, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import * as FontAwesome from '@fortawesome/free-solid-svg-icons';
import { IVacation, VacationApply } from '../vacation.model';
import { VacationDateService } from '../service/vacation-date.service';
import { Remaining, VacationService } from '../service/vacation.service';
import { VacationState } from '../../enumerations/vacation-state.model';

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

  vacations: IVacation[] = [];

  VacationState = VacationState;

  year = new Date().getFullYear();

  constructor(
    private calendar: NgbCalendar,
    public formatter: NgbDateParserFormatter,
    public vacationDateService: VacationDateService,
    private vacationService: VacationService
  ) {
    this.fromDate = null;
    this.toDate = null;
    this.choosenDays = null;
  }

  ngOnInit(): void {
    // TODO query for free days and current lists
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
      this.choosenDays = this.vacationDateService.getVacationDays(fromDateJs, toDateJs);
    }
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
        start: VacationApplyCreateComponent.ngbDateToJsDate(this.fromDate),
        end: VacationApplyCreateComponent.ngbDateToJsDate(this.toDate),
        state: 'APPLIED',
      };

      this.vacationService.apply(vacationApply).subscribe({
        next: res => {
          this.loadVacations();
        },
      });
    }
  }

  loadVacations(): void {
    const query = {
      start: `${this.year}-01-01`,
      end: `${this.year + 1}-01-01`,
      currentUserOnly: true,
    };
    this.vacationService.query(query).subscribe({ next: res => this.onDataFetched(res.body) });

    this.vacationService.remaining().subscribe({
      next: res => {
        this.onRemainingFetched(res.body);
      },
    });
  }

  private onDataFetched(vacations: IVacation[] | null) {
    console.log(vacations);
    if (vacations != null) {
      this.vacations = vacations;
    }
  }

  private onRemainingFetched(remaining?: Remaining | null) {
    if (remaining) {
      this.availableVacation = remaining.remainingDays;
    }
  }
}
