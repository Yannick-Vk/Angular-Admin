export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoggedInUser {
  username: string;
  password: string;
  jwt: string;
}
