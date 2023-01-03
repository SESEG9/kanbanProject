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
  type?: HumanResourceType;
  abbr?: string;
  gender?: Gender;
  birthday?: Date;
  phone?: string;
  ssn?: string;
  banking?: string;
}

export enum HumanResourceType {
  RECEPTION,
  KITCHEN,
  SERVICE,
  CLEANING,
  OTHER,
}

export enum Gender {
  MALE,
  FEMALE,
  DIVERSE,
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
    public type?: HumanResourceType,
    public abbr?: string,
    public gender?: Gender,
    public birthday?: Date,
    public phone?: string,
    public ssn?: string,
    public banking?: string
  ) {}
}
