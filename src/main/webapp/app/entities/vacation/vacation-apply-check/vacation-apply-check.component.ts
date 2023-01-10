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

@Component({
  selector: 'jhi-vacation-apply-check',
  templateUrl: './vacation-apply-check.component.html',
  styleUrls: ['./vacation-apply-check.component.scss', '../../room/room.global.scss'],
})
export class VacationApplyCheckComponent implements OnInit {
  vacation: IVacation | null = null;

  overlappings: IVacation[] = [];
  VacationState = VacationState;

  constructor(
    public vacationDateService: VacationDateService,
    private route: ActivatedRoute,
    protected modalService: NgbModal,
    private router: Router,
    private vacationService: VacationService
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
        },
      })
    );
    // TODO use this parameter to load the data from the backend
  }

  private loadOverlappings() {
    const query = {
      start: dayjs(this.vacation?.start).format('yyyy-MM-dd'),
      end: dayjs(this.vacation?.end).format('yyyy-MM-dd'),
      currentUserOnly: false,
    };
    this.vacationService.query(query).subscribe({ next: res => this.onOverlappingsLoaded(res.body) });
  }

  private onOverlappingsLoaded(overlappings: IVacation[] | null) {
    if (overlappings) {
      this.overlappings = overlappings;
    }
  }
}
