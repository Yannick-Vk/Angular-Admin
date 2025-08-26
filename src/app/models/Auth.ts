interface User {
  UserName: string;
}

interface UserWithPassword extends User {
  password: string;
}

export interface LoginRequest extends UserWithPassword {
  password: string;
}

export interface RegisterRequest extends UserWithPassword {
  password: string;
  email: string;
}

export interface Jwt {
  Token: string;
  ExpiresIn: number;
}
