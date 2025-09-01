export interface Role {
  id: number;
  name: string;
}

export class RoleDto {
  roleName: string;

  constructor(roleName: string) {
    this.roleName = roleName;
  }
}

export class UserWithRoleDto {
  roleName: string;
  username: string;

  constructor(roleName: string, username: string) {
    this.roleName = roleName;
    this.username = username;
  }
}
