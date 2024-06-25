export interface BaseOptions {
  onSuccess?: (data?: any) => void;
  onError?: (error?: any) => void;
}

export interface BaseUser {
  email: string;
  password: string;
}

export interface RegisterUserParams extends BaseUser, BaseOptions {}

export interface LoginUserParams extends BaseUser, BaseOptions {}

export interface User {
  name: string;
  email: string;
}

export interface UserSlice {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
}
