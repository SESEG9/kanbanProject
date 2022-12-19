import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { Observable } from 'rxjs';
import { IDiscount } from '../type/discount';

@Injectable({
  providedIn: 'root'
})
export class DiscountService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/discounts');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}


  getDiscountIdentifier(discount: Pick<IDiscount, 'discountCode'>): string {
    return discount.discountCode;
  }

  delete(discountCode: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}?discountCode=${discountCode}`, { observe: 'response' });
  }

  query(): Observable<IDiscount[]> {
    return this.http.get<IDiscount[]>(this.resourceUrl);
  }

  create(discount: IDiscount): Observable<IDiscount> {
    // eslint-disable-next-line radix, @typescript-eslint/restrict-plus-operands
    return this.http.post<IDiscount>(this.resourceUrl + `?discountCode=${discount.discountCode}&discountPercentage=${parseInt(discount.discountPercentage+"")}`, {})
  }
}
