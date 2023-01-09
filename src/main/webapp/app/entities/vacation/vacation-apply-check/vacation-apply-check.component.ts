import { Component, OnInit } from '@angular/core';
import { IVacation, VacationApplyUser } from '../vacation.model';
import { VacationDateService } from '../service/vacation-date.service';
import { ActivatedRoute, Router } from '@angular/router';
import { VacationRejectDialogComponent } from '../dialog-reject/vacation-reject-dialog.component';
import { filter } from 'rxjs';
import { VACATION_APPROVED, VACATION_REJECTED } from '../vacation.constants';
import { EntityArrayResponseType, VacationService } from '../service/vacation.service';
import { VacationApproveDialogComponent } from '../dialog-approve/vacation-approve-dialog.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'jhi-vacation-apply-check',
  templateUrl: './vacation-apply-check.component.html',
  styleUrls: ['./vacation-apply-check.component.scss', '../../room/room.global.scss'],
})
export class VacationApplyCheckComponent implements OnInit {
  vacation: IVacation | null = null;

  overlappings: VacationApplyUser[] = [];

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
        },
      })
    );
    // TODO use this parameter to load the data from the backend

    this.overlappings = [
      {
        start: new Date('2023-02-01'),
        end: new Date('2023-02-04'),
        state: 'APPROVED',
        id: 15,
        user: {
          firstName: 'Jürgen',
          lastName: 'Müller',
          area: 'Rezeption',
          freeVacation: 10,
        },
      },
      {
        start: new Date('2023-02-01'),
        end: new Date('2023-02-15'),
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
        start: new Date('2023-01-30'),
        end: new Date('2023-02-06'),
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
        start: new Date('2023-01-25'),
        end: new Date('2023-02-01'),
        state: 'APPROVED',
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
