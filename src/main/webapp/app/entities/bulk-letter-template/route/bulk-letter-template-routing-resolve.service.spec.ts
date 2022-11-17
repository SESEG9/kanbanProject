import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IBulkLetterTemplate } from '../bulk-letter-template.model';
import { BulkLetterTemplateService } from '../service/bulk-letter-template.service';

import { BulkLetterTemplateRoutingResolveService } from './bulk-letter-template-routing-resolve.service';

describe('BulkLetterTemplate routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: BulkLetterTemplateRoutingResolveService;
  let service: BulkLetterTemplateService;
  let resultBulkLetterTemplate: IBulkLetterTemplate | null | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({}),
            },
          },
        },
      ],
    });
    mockRouter = TestBed.inject(Router);
    jest.spyOn(mockRouter, 'navigate').mockImplementation(() => Promise.resolve(true));
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRoute).snapshot;
    routingResolveService = TestBed.inject(BulkLetterTemplateRoutingResolveService);
    service = TestBed.inject(BulkLetterTemplateService);
    resultBulkLetterTemplate = undefined;
  });

  describe('resolve', () => {
    it('should return IBulkLetterTemplate returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultBulkLetterTemplate = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultBulkLetterTemplate).toEqual({ id: 123 });
    });

    it('should return null if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultBulkLetterTemplate = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultBulkLetterTemplate).toEqual(null);
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse<IBulkLetterTemplate>({ body: null })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultBulkLetterTemplate = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultBulkLetterTemplate).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
