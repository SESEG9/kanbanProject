export interface Employee {
  id: number;
  login?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  imageUrl?: any;
  activated?: boolean;
  langKey?: string;
  createdBy?: string;
  createdDate?: string;
  lastModifiedBy?: string;
  lastModifiedDate?: string;
  type?: string;
  birthday?: string;
  gender?: string;
  phone?: string;
  ssn?: string;
  banking?: string;
  address?: string;
  authorities?: string[];
}
