/* eslint-disable @typescript-eslint/restrict-plus-operands */
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

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  getWorkSchedule(userIds: number[], workDays: string[], timeSlots: string[]) {
    let params = '';
    if (userIds.length > 0) {
      params += '?userIds=' + userIds[0];
      userIds.forEach((id, index) => (params += index > 0 ? '&userIds=' + id : ''));
    }
    if (workDays.length > 0) {
      if (params.includes('?')) {
        workDays.forEach(workday => (params += '&workDays=' + workday));
      } else {
        params += '?workDays=' + workDays[0];
        workDays.forEach((id, index) => (params += index > 0 ? '&workDays=' + id : ''));
      }
    }
    if (timeSlots.length > 0) {
      if (params.includes('?')) {
        timeSlots.forEach(timeSlot => (params += '&timeSlots=' + timeSlot));
      } else {
        params += '?timeSlots=' + timeSlots[0];
        timeSlots.forEach((timeSlot, index) => (params += index > 0 ? '&timeSlots=' + timeSlot : ''));
      }
    }
    return this.http.get<WorkScheduleResponse[]>(this.resourceUrl + params);
  }
}
