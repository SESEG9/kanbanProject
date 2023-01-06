import { HumanResourceType } from '../../entities/enumerations/human-resource-type.model';
import { Gender } from '../../entities/enumerations/gender.model';

export interface IUser {
  id: number | null;
  login?: string;
  firstName?: string | null;
  lastName?: string | null;
  email?: string;
  activated?: boolean;
  langKey?: string;
  authorities?: string[];
  createdBy?: string;
  createdDate?: Date;
  lastModifiedBy?: string;
  lastModifiedDate?: Date;
  type?: string;
  gender?: string;
  birthday?: Date;
  phone?: string;
  ssn?: string;
  banking?: string;
  address?: string;
}

export class User implements IUser {
  constructor(
    public id: number | null,
    public login?: string,
    public firstName?: string | null,
    public lastName?: string | null,
    public email?: string,
    public activated?: boolean,
    public langKey?: string,
    public authorities?: string[],
    public createdBy?: string,
    public createdDate?: Date,
    public lastModifiedBy?: string,
    public lastModifiedDate?: Date,
    public type?: string,
    public gender?: string,
    public birthday?: Date,
    public phone?: string,
    public ssn?: string,
    public banking?: string,
    public address?: string
  ) {}
}
