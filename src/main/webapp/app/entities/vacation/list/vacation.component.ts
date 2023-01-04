import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data, ParamMap, Router } from '@angular/router';
import { combineLatest, filter, Observable, switchMap, tap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IVacation, VacationApplyUser } from '../vacation.model';
import { ASC, DEFAULT_SORT_DATA, DESC, ITEM_DELETED_EVENT, SORT } from 'app/config/navigation.constants';
import { EntityArrayResponseType, VacationService } from '../service/vacation.service';
import { VacationDeleteDialogComponent } from '../delete/vacation-delete-dialog.component';
import { SortService } from 'app/shared/sort/sort.service';
import * as FontAwesome from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'jhi-vacation',
  templateUrl: './vacation.component.html',
  styleUrls: ['../../room/room.global.scss', 'vacation.component.scss'],
})
export class VacationComponent implements OnInit {
  ICONS = FontAwesome;

  vacations?: IVacation[];

  vacationApply: VacationApplyUser[] = [
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

  isLoading = false;

  predicate = 'id';
  ascending = true;

  constructor(
    protected vacationService: VacationService,
    protected activatedRoute: ActivatedRoute,
    public router: Router,
    protected sortService: SortService,
    protected modalService: NgbModal
  ) {}

  trackId = (_index: number, item: IVacation): number => this.vacationService.getVacationIdentifier(item);

  ngOnInit(): void {
    this.load();
  }

  delete(vacation: IVacation): void {
    const modalRef = this.modalService.open(VacationDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.vacation = vacation;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed
      .pipe(
        filter(reason => reason === ITEM_DELETED_EVENT),
        switchMap(() => this.loadFromBackendWithRouteInformations())
      )
      .subscribe({
        next: (res: EntityArrayResponseType) => {
          this.onResponseSuccess(res);
        },
      });
  }

  load(): void {
    this.loadFromBackendWithRouteInformations().subscribe({
      next: (res: EntityArrayResponseType) => {
        this.onResponseSuccess(res);
      },
    });
  }

  navigateToWithComponentValues(): void {
    this.handleNavigation(this.predicate, this.ascending);
  }

  protected loadFromBackendWithRouteInformations(): Observable<EntityArrayResponseType> {
    return combineLatest([this.activatedRoute.queryParamMap, this.activatedRoute.data]).pipe(
      tap(([params, data]) => this.fillComponentAttributeFromRoute(params, data)),
      switchMap(() => this.queryBackend(this.predicate, this.ascending))
    );
  }

  protected fillComponentAttributeFromRoute(params: ParamMap, data: Data): void {
    const sort = (params.get(SORT) ?? data[DEFAULT_SORT_DATA]).split(',');
    this.predicate = sort[0];
    this.ascending = sort[1] === ASC;
  }

  protected onResponseSuccess(response: EntityArrayResponseType): void {
    const dataFromBody = this.fillComponentAttributesFromResponseBody(response.body);
    this.vacations = this.refineData(dataFromBody);
  }

  protected refineData(data: IVacation[]): IVacation[] {
    return data.sort(this.sortService.startSort(this.predicate, this.ascending ? 1 : -1));
  }

  protected fillComponentAttributesFromResponseBody(data: IVacation[] | null): IVacation[] {
    return data ?? [];
  }

  protected queryBackend(predicate?: string, ascending?: boolean): Observable<EntityArrayResponseType> {
    this.isLoading = true;
    const queryObject = {
      sort: this.getSortQueryParam(predicate, ascending),
    };
    return this.vacationService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
  }

  protected handleNavigation(predicate?: string, ascending?: boolean): void {
    const queryParamsObj = {
      sort: this.getSortQueryParam(predicate, ascending),
    };

    this.router.navigate(['./'], {
      relativeTo: this.activatedRoute,
      queryParams: queryParamsObj,
    });
  }

  protected getSortQueryParam(predicate = this.predicate, ascending = this.ascending): string[] {
    const ascendingQueryParam = ascending ? ASC : DESC;
    if (predicate === '') {
      return [];
    } else {
      return [predicate + ',' + ascendingQueryParam];
    }
  }

  datediff(first: Date, second: Date): number {
    return Math.round((second.getTime() - first.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  }
}
