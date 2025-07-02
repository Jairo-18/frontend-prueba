import { RoleType } from '../../shared/interfaces/relatedDataGeneral';

export interface CreateUserPanel {
  userId?: string;
  identificationNumber: string;
  fullName: string;
  email: string;
  dateOfBirth: Date;
  password?: string;
  confirmPassword?: string;
  roleType?: string;
}

export interface UserComplete {
  userId: string;
  identificationNumber: string;
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  dateOfBirth: Date;
  roleType?: RoleType;
  createdAt: Date;
}
