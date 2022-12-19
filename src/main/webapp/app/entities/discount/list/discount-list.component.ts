import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data, ParamMap, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ASC, DEFAULT_SORT_DATA, DESC, ITEM_DELETED_EVENT, SORT } from 'app/config/navigation.constants';
import { SortService } from 'app/shared/sort/sort.service';
import { combineLatest, filter, Observable, switchMap, tap } from 'rxjs';
import { DiscountDeleteComponent } from '../delete/discount-delete-dialog.component';
import { DiscountService } from '../service/discount.service';
import { IDiscount } from '../type/discount';

@Component({
  selector: 'jhi-discount-list',
  templateUrl: './discount-list.component.html'
})
export class DiscountListComponent implements OnInit {
  discounts?: IDiscount[];
  isLoading = false;

  predicate = 'id';
  ascending = true;

  constructor(
    protected discountService: DiscountService,
    protected activatedRoute: ActivatedRoute,
    public router: Router,
    protected sortService: SortService,
    protected modalService: NgbModal
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  trackId = (_index: number, item: IDiscount): string => this.discountService.getDiscountIdentifier(item);

  ngOnInit(): void {
    this.load();
  }

  delete(discount: IDiscount): void {
    const modalRef = this.modalService.open(DiscountDeleteComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.discount = discount;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed
      .pipe(
        filter(reason => reason === ITEM_DELETED_EVENT),
        switchMap(() => this.loadFromBackendWithRouteInformations())
      )
      .subscribe({
        next: (res: IDiscount[]) => {
          this.onResponseSuccess(res);
        },
      });
  }

  load(): void {
    this.loadFromBackendWithRouteInformations().subscribe({
      next: (res: IDiscount[]) => {
        this.onResponseSuccess(res);
      },
    });
  }

  navigateToWithComponentValues(): void {
    this.handleNavigation(this.predicate, this.ascending);
  }

  protected loadFromBackendWithRouteInformations(): Observable<IDiscount[]> {
    return combineLatest([this.activatedRoute.queryParamMap, this.activatedRoute.data]).pipe(
      tap(([params, data]) => this.fillComponentAttributeFromRoute(params, data)),
      switchMap(() => this.queryBackend())
    );
  }

  protected fillComponentAttributeFromRoute(params: ParamMap, data: Data): void {
    const sort = (params.get(SORT) ?? data[DEFAULT_SORT_DATA]).split(',');
    this.predicate = sort[0];
    this.ascending = sort[1] === ASC;
  }

  protected onResponseSuccess(response: IDiscount[]): void {
    const dataFromBody = this.fillComponentAttributesFromResponseBody(response);
    this.discounts = this.refineData(dataFromBody);
  }

  protected refineData(data: IDiscount[]): IDiscount[] {
    return data.sort(this.sortService.startSort(this.predicate, this.ascending ? 1 : -1));
  }

  protected fillComponentAttributesFromResponseBody(data: IDiscount[] | null): IDiscount[] {
    return data ?? [];
  }

  protected queryBackend(): Observable<IDiscount[]> {
    this.isLoading = true;
    return this.discountService.query().pipe(tap(() => (this.isLoading = false)));
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
