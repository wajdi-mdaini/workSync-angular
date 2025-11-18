export interface User {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  dateOfBirth: any;
  creationDate: number;
  holidaySold: number;
  sicknessLeaverSold: number;
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
  documents: Document[];
  company: Company;
}

export interface Team {
  id: number
  name: string;
  description: string;
  members: User[];
  manager: User;
  company: Company;
}

export enum Role {
  ADMIN = "ADMIN", MANAGER = "MANAGER", EMPLOYEE = "EMPLOYEE"
}

export enum HolidayType {
  SICKNESS_LEAVER = "SICKNESS_LEAVER", ANNUAL_LEAVER = "ANNUAL_LEAVER", PERMISSION = "PERMISSION"
}

export enum HolidayStatus {
  WAITING = "WAITING", APPROVED = "APPROVED", REJECTED = "REJECTED"
}

export interface Company {
  id: number
  name: string;
  description: string;
  address: string;
  email: string;
  phone: number;
  website: string;
  logoURL: string;
  settings: CompanySettings;
  logoPublicId: string;
  companyCreator: User;
  teams: Team[];
  members: User[];
  branding: Branding[];
}

export interface CompanySettings {
  id: number;
  verificationCodeLength: number;
  verificationCodeExpireIn: number;
  jwtTokenExpireIn: number;
  holidayDaysPerMonth: number;
  sicknessLeaverDaysPerYear: number;
  passwordMinLength: number;
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
  company: Company;
}

export interface LoginRequest {
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

export interface TeamDetailsResponse {
  team: Team;
  members: User[];
  manager: User;
}

export interface EditTeamRequest {
  remainingUsers: string[];
  teamMembers: string[];
  managerEmail: string;
  team: Team;
}

export interface AddTeamRequest {
  memberEmails: string[];
  team: Team;
  managerEmail: string;
}

export interface GetUsersRequest {
  userEmail: string;
  companyId: number;
}

export interface EditUserRequest {
  editRequest: boolean;
  userDTO: UserDTO;
}

export interface Document {
  id: number;
  name: string;
  description: string;
  size: string;
  url: string;
  type: string;
  to: User;
  from: User;
  at: number;
}

export interface UserDTO {
  firstname: string;
  email: string;
  lastname: string;
  dateOfBirth: number;
  address: string;
  city: string;
  country: string;
  postCode: string;
  degree: string;
  title: string;
  teamId: number;
}

export interface CompanyDTO {
  companyName: string;
  companyEmail: string;
  description: string;
  companyPhone: number;
  companyWebLink: string;
  companyAddress: string;
  companyId: number;
}

export interface DocumentDTO {
  name: string;
  description: string;
  toUserEmail: string;
  documentId: number;
}

export interface Holiday {
  id: number;
  from: number;
  to: number;
  at: number;
  user: User;
  type: HolidayType;
  status: HolidayStatus;
}

export interface BookHolidayDTO {
  from: number;
  to: number;
  countedDays: number;
  type: HolidayType;
  status: HolidayStatus;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  at: number;
  from: number;
  to: number;
  eventType: EventType;
  participants: User[];
  organizer: User;
}
export interface EventDTO {
  title: string;
  description: string;
  at: number;
  from: number;
  to: number;
  type:EventType;
  participantEmails: string[];
  organizerEmail: string;
}
export interface EditEventDTO {
  id: any ;
  title: string;
  description: string;
  at: number;
  from: number | undefined;
  to: number | undefined;
  type:EventType;
  participantEmails: string[];
  fullcalendarEvent: boolean;
  organizerEmail: string;
}
export enum EventType {
  ACTIVITY='ACTIVITY', MEETING = 'MEETING', TASK = 'TASK', EVENT = 'EVENT'
}
