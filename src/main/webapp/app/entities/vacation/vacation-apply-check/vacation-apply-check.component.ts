import { Component, OnInit } from '@angular/core';
import { IVacation } from '../vacation.model';
import { VacationDateService } from '../service/vacation-date.service';
import { ActivatedRoute, Router } from '@angular/router';
import { VacationRejectDialogComponent } from '../dialog-reject/vacation-reject-dialog.component';
import { filter } from 'rxjs';
import { VACATION_APPROVED, VACATION_REJECTED } from '../vacation.constants';
import { EntityArrayResponseType, VacationService } from '../service/vacation.service';
import { VacationApproveDialogComponent } from '../dialog-approve/vacation-approve-dialog.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { VacationState } from '../../enumerations/vacation-state.model';
import dayjs from 'dayjs';
import { FixedVacation, FixedVacationService } from '../service/fixed-vacation.service';

@Component({
  selector: 'jhi-vacation-apply-check',
  templateUrl: './vacation-apply-check.component.html',
  styleUrls: ['./vacation-apply-check.component.scss', '../../room/room.global.scss'],
})
export class VacationApplyCheckComponent implements OnInit {
  vacation: IVacation | null = null;

  overlappings: FixedVacation[] = [];
  VacationState = VacationState;

  startYear: { year: number; remaining: number } | null = null;
  endYear: { year: number; remaining: number } | null = null;

  constructor(
    public vacationDateService: VacationDateService,
    private route: ActivatedRoute,
    protected modalService: NgbModal,
    private router: Router,
    private vacationService: VacationService,
    private fixedVacationService: FixedVacationService
  ) {}

  reject(vacation: IVacation | null): void {
    if (vacation != null) {
      const modalRef = this.modalService.open(VacationRejectDialogComponent, { backdrop: 'static' });
      modalRef.componentInstance.vacation = vacation;
      // unsubscribe not needed because closed completes on modal close

      modalRef.closed.pipe(filter(reason => reason === VACATION_REJECTED)).subscribe({
        next: (res: EntityArrayResponseType) => {
          this.router.navigateByUrl('/vacation');
        },
      });
    }
  }

  approve(vacation: IVacation | null): void {
    if (vacation != null) {
      const modalRef = this.modalService.open(VacationApproveDialogComponent, { backdrop: 'static' });
      modalRef.componentInstance.vacation = vacation;
      // unsubscribe not needed because closed completes on modal close

      modalRef.closed.pipe(filter(reason => reason === VACATION_APPROVED)).subscribe({
        next: (res: EntityArrayResponseType) => {
          this.router.navigateByUrl('/vacation');
        },
      });
    }
  }

  ngOnInit(): void {
    this.route.params.subscribe(param =>
      this.vacationService.find(+param.id).subscribe({
        next: res => {
          this.vacation = res.body;
          this.loadOverlappings();
          this.loadRemainingVacation();
        },
      })
    );

    // TODO use this parameter to load the data from the backend
  }

  private loadRemainingVacation() {
    if (this.vacation && this.vacation.start && this.vacation.end) {
      this.startYear = null;
      this.endYear = null;

      const start = this.vacation.start.year();
      const end = this.vacation.end.year();

      this.vacationService.remaining({ year: start, userId: this.vacation.user?.id, includeRequested: false }).subscribe({
        next: res => (this.startYear = { year: start, remaining: res.body?.remainingDays ?? 0 }),
      });

      if (start != end) {
        this.vacationService.remaining({ year: end, userId: this.vacation.user?.id, includeRequested: false }).subscribe({
          next: res => (this.endYear = { year: end, remaining: res.body?.remainingDays ?? 0 }),
        });
      }
    }
  }

  private loadOverlappings() {
    const query = {
      start: dayjs(this.vacation?.start).format('YYYY-MM-DD'),
      end: dayjs(this.vacation?.end).format('YYYY-MM-DD'),
      currentUserOnly: false,
    };
    this.vacationService.query(query).subscribe({ next: res => this.onOverlappingsLoaded(res.body) });
  }

  private onOverlappingsLoaded(overlappings: IVacation[] | null) {
    if (overlappings) {
      this.overlappings = this.fixedVacationService.vacationsToFixedVacations(overlappings);
    }
  }

  getStartYearRemaining(): number {
    if (this.vacation && this.vacation.start && this.vacation.end && this.startYear) {
      return this.vacationDateService.getRemainingDaysForStartYear(
        this.vacation.start.toDate(),
        this.vacation.end.toDate(),
        this.startYear.remaining
      );
    } else {
      return this.startYear?.remaining ?? 0;
    }
  }

  getEndYearRemaining(): number {
    if (this.vacation && this.vacation.start && this.vacation.end && this.startYear) {
      return this.vacationDateService.getRemainingDaysForEndYear(this.vacation.end.toDate(), this.startYear.remaining);
    } else {
      return this.endYear?.remaining ?? 0;
    }
  }
}
