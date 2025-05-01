export interface AuthRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    username: string;
    balance: number;
    image: string;
    _id: string;
  };
}

export interface UserProfile {
  username: string;
  balance: number;
  image: string;
  _id: string;
}

export interface ProfileUpdateRequest {
  image: File;
}
