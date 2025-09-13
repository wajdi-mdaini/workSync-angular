export interface User {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  dateOfBirth: Date;
  creationDate: Date;
  isFirstLogin: boolean;
  locked: boolean;
  attempts: number;
  role: Role;
  manager: User;
  employees: User[];
  company: Company;
  notifications: CustomNotification[];
}
export enum Role {
  ADMIN = "ADMIN",MANAGER="MANAGER",EMPLOYEE="EMPLOYEE"
}
export interface Company {
  id: number
  name: string;
  description: string;
  address: string;
  email: string;
  phone: number;
  website: string;
  users: User[];
  branding: Branding[];
}
export interface CustomNotification {
  id: number;
  title: string;
  message: string;
  read: boolean;
  user: User;
}
export interface Branding {
  id: number;
  label: string;
  value: string;
  company: Company;
}
export interface SharedSettings {
  verificationCodeLength: number;
  verificationCodeExpireIn: number;
}
export interface LoginResponse {
  user: User;
  token: string;
}
export interface LoginRequest{
  email: string;
  password: string;
}
export interface SignUpRequest {
  user: User;
  company: Company;
}
export interface ChangePasswordRequest {
  password: string;
  lastPasswordResetDate: any;
}
export interface ApiResponse {
  status: any,
  messageLabel: string;
  data: any;
  success: boolean;
  showToast: boolean;
  doLogout: boolean;
}
