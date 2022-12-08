import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data, ParamMap, Router } from '@angular/router';
import { combineLatest, filter, Observable, switchMap, tap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IRoom, RoomPrice, RoomResponse, RoomPicture } from '../room.model';
import { ASC, DESC, SORT, ITEM_DELETED_EVENT, DEFAULT_SORT_DATA } from 'app/config/navigation.constants';
import { EntityArrayResponseType, RoomService } from '../service/room.service';
import { RoomDeleteDialogComponent } from '../delete/room-delete-dialog.component';
import { SortService } from 'app/shared/sort/sort.service';
import { AccountService } from '../../../core/auth/account.service';
import { Authority } from '../../../config/authority.constants';
import { RoomPictureService } from '../../room-picture/service/room-picture.service';

interface IRoomWithMinPrice extends IRoom {
  minPrice?: number | null;
  picture?: RoomPicture | null;
}

@Component({
  selector: 'jhi-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss'],
})
export class RoomComponent implements OnInit {
  rooms?: IRoomWithMinPrice[];

  isLoading = false;

  predicate = 'id';
  ascending = true;
  Authority = Authority;

  constructor(
    protected roomService: RoomService,
    protected activatedRoute: ActivatedRoute,
    public router: Router,
    protected sortService: SortService,
    protected modalService: NgbModal,
    protected accountService: AccountService,
    private roomPictureService: RoomPictureService
  ) {}

  trackId = (_index: number, item: IRoom): number => this.roomService.getRoomIdentifier(item);

  ngOnInit(): void {
    this.load();
  }

  hasAnyAuthority(authorities: string[] | string): boolean {
    return this.accountService.hasAnyAuthority(authorities);
  }

  getMinPrice(prices: RoomPrice[] | null | undefined): number | null {
    if (!prices || prices.length < 1) {
      return null;
    }
    return Math.min(...prices.map(p => p.price)) / 100;
  }

  delete(room: IRoom): void {
    if (!this.hasAnyAuthority(Authority.ADMIN)) {
      return;
    }
    const modalRef = this.modalService.open(RoomDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.room = room;
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
    let dataFromBody = this.fillComponentAttributesFromResponseBody(response.body);
    this.rooms = this.refineData(dataFromBody);
  }

  protected refineData(data: IRoom[]): IRoom[] {
    return data.sort(this.sortService.startSort(this.predicate, this.ascending ? 1 : -1));
  }

  protected fillComponentAttributesFromResponseBody(data: IRoomWithMinPrice[] | null): IRoomWithMinPrice[] {
    let responseRooms = data ?? [];
    responseRooms.forEach(r => {
      r.minPrice = this.getMinPrice(r.prices);
      console.log(r.pictureIDs);
      if (r.pictureIDs && r.pictureIDs.length > 0) {
        this.roomPictureService.find(r.pictureIDs[0]).subscribe({ next: next => (r.picture = next.body) });
      }
    });
    return responseRooms;
  }

  protected queryBackend(predicate?: string, ascending?: boolean): Observable<EntityArrayResponseType> {
    this.isLoading = true;
    const queryObject = {
      sort: this.getSortQueryParam(predicate, ascending),
    };
    return this.roomService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
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
}
