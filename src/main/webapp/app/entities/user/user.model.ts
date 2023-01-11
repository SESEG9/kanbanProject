import { HumanResourceType } from '../enumerations/human-resource-type.model';

export interface IUser {
  id: number;
  login?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  activated?: boolean;
  type?: HumanResourceType;
}

export class User implements IUser {
  constructor(public id: number, public login: string) {}
}

export function getUserIdentifier(user: IUser): number {
  return user.id;
}
