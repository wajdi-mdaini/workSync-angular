export interface User {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  dateOfBirth: Date;
  creationDate: Date;
  lastPasswordResetDate: Date;
  firstLogin: boolean;
  locked: boolean;
  attempts: number;
  verificationCode: string;
  role: Role;
  team: Team;
  teams: Team[];
  notifications: CustomNotification[];
}
export interface Team{
  id: number
  name: string;
  description: string;
  members: User[];
  manager: User;
  company: Company;
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
  companyCreator: User;
  teams: Team[];
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
