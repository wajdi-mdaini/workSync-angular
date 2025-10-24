export interface User {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  dateOfBirth: number;
  creationDate: number;
  lastPasswordResetDate: number;
  firstLogin: boolean;
  locked: boolean;
  profilePictureUrl: string;
  profilePicturePublicId: string;
  attempts: number;
  verificationCode: string;
  role: Role;
  team: Team;
  teams: Team[];
  notificationsFrom: CustomNotification[];
  notificationsTo: CustomNotification[];
  degree: string;
  address: string;
  city: string;
  country: string;
  postCode: string;
  title: string;
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
  titleLabel: string;
  messageLabel: string;
  read: boolean;
  at: number;
  from: User;
  to: User;
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
export interface NotificationDTO {
  id: number;
  at: number;
  titleLabel: string;
  messageLabel: string;
  fromName: string;
  fromId: string;
  fromProfilePictureUrl: string;
  read: boolean;
}
export interface TeamDetailsResponse{
  teamManager: User;
  members: User[];
}
export interface EditTeamRequest{
  remainingUsers: string[];
  teamMembers: string[];
  managerEmail: string;
  team: Team;
}
