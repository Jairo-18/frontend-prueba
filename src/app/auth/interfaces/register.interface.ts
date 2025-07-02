import { RoleType } from '../../shared/interfaces/relatedDataGeneral';

export interface RegisterUser {
  userId: string;
  identificationType: string;
  identificationNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneCode: string;
  phone: string;
  password: string;
  confirmPassword: string;
  roleType?: string;
}

export interface CreateUserRelatedData {
  roleType: RoleType[];
}
