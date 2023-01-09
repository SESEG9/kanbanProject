import { User } from './user';

export interface WorkSchedule {
  userId: number;
  workday: string;
  timeSlot: string;
}

export interface TimeSlot {
  name: string;
  startTime: Time;
  endTime: Time;
}
export interface Time {
  hour: number;
  minute: number;
  second: number;
  nano: number;
}

export interface WorkScheduleResponse {
  id: number;
  user: User;
  timeSlot: TimeSlot;
  workday: string;
}
