import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { BaseService } from './base.service';
import { User } from '../interfaces/user';
import { UserProfile } from '../interfaces/auth/auth';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService extends BaseService {
  private readonly baseUrl = 'https://react-bank-project.eapi.joincoded.com';

  constructor(_http: HttpClient, private authService: AuthService) {
    super(_http);
  }

  getProfile(): Observable<UserProfile> {
    return this.get<UserProfile>(
      `${this.baseUrl}/mini-project/api/auth/me`,
      undefined,
      { Authorization: `Bearer ${this.authService.getToken()}` }
    ).pipe(
      catchError((error) => {
        console.error('Failed to fetch profile:', error);
        return throwError(() => error);
      })
    );
  }

  getAllUsers(): Observable<User[]> {
    return this.get<User[]>(
      `${this.baseUrl}/mini-project/api/auth/users`,
      undefined,
      { Authorization: `Bearer ${this.authService.getToken()}` }
    ).pipe(
      catchError((error) => {
        console.error('Failed to fetch users:', error);
        return throwError(() => error);
      })
    );
  }

  updateProfile(formData: FormData): Observable<UserProfile> {
    return this.put<UserProfile, FormData>(
      `${this.baseUrl}/mini-project/api/auth/profile`,
      formData,
      undefined,
      { Authorization: `Bearer ${this.authService.getToken()}` }
    ).pipe(
      catchError((error) => {
        console.error('Failed to update profile:', error);
        return throwError(() => error);
      })
    );
  }

  getUserById(userId: string): Observable<User> {
    return this.get<User>(
      `${this.baseUrl}/mini-project/api/auth/user/${userId}`,
      undefined,
      { Authorization: `Bearer ${this.authService.getToken()}` }
    ).pipe(
      catchError((error) => {
        console.error(`Failed to fetch user ${userId}:`, error);
        return throwError(() => error);
      })
    );
  }
}
