import { RoleType } from '../../shared/interfaces/relatedDataGeneral';

export interface RegisterUser {
  userId: string;
  identificationNumber: string;
  fullName: string;
  email: string;
  password: string;
  dateOfBirth: Date;
  confirmPassword: string;
  roleType?: string;
}

export interface CreateUserRelatedData {
  roleType: RoleType[];
}
