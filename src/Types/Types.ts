export enum Roles {
  ADMIN = "Admin",
  TEACHER = "Teacher",
}

export interface IAdminActionData {
  adminAction: boolean;
  adminId: string;
}
