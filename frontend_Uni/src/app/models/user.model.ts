export interface UserModel {
  id?: number;
  username: string;
  email: string;
  roles_id: number;
  token?: string;
  created_at?: string;
  updated_at?: string;
}

export interface EditUserPayload {
  username: string;
  password: string;
  password_confirmation: string;
}

// Payload for adding a new user
export interface AddUserPayload {
  username: string;
  email: string;
  password: string;
}

// Response type for successful operations
export interface ApiSuccessResponse {
  message?: string;
  user?: UserModel;
}

// Error response type
export interface ApiErrorResponse {
  errors?: {
    username?: string[];
    email?: string[];
    password?: string[];
    [key: string]: any;
  };
  message?: string;
}