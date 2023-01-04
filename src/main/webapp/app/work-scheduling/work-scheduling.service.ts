import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { Observable } from 'rxjs';
import { Employee } from './types/employee';
import { WorkSchedule, WorkScheduleResponse } from './types/work.schedule';

@Injectable({
  providedIn: 'root',
})
export class WorkSchedulingService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/time-managements');
  protected publicResourceUrl = this.applicationConfigService.getEndpointFor('api/public/time-managements');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.applicationConfigService.getEndpointFor('api/users'));
  }

  createWorkSchedule(workSchedule: WorkSchedule): Observable<any> {
    return this.http.post(this.resourceUrl, workSchedule);
  }

  getMySchedule(): Observable<WorkScheduleResponse[]> {
    return this.http.get<WorkScheduleResponse[]>(this.resourceUrl);
  }
}
