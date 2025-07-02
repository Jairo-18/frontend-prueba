export interface UserInterface {
  userId: string;
  identificationNumber: string;
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  roleType?: RoleType;
  createdAt: Date;
  dateOfBirth: Date;
}

export interface RoleType {
  roleTypeId: string;
  code?: string;
  name?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface PhoneCode {
  phoneCodeId: string;
  code?: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface IdentificationType {
  identificationTypeId: string;
  code?: string;
  name?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
