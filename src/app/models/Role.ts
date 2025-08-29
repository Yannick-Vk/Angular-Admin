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
