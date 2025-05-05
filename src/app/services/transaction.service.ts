import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { BaseService } from './base.service';
import { Transaction, TransactionQuery } from '../interfaces/transaction';
import { AuthService } from './auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class TransactionService extends BaseService {
  private readonly baseUrl = 'https://react-bank-project.eapi.joincoded.com';

  constructor(http: HttpClient, private authService: AuthService) {
    super(http);
  }

  /**
   * Fetch the logged-in user’s transactions, optionally filtered by the given query.
   */
  getMyTransactions(query?: TransactionQuery): Observable<Transaction[]> {
    const params: Record<string, any> = {};
    if (query?.type) params['type'] = query.type;
    if (query?.dateFrom) params['dateFrom'] = query.dateFrom;
    if (query?.dateTo) params['dateTo'] = query.dateTo;

    return this.get<Transaction[]>(
      `${this.baseUrl}/mini-project/api/transactions/my`,
      params,
      { Authorization: `Bearer ${this.authService.getToken()}` }
    ).pipe(
      catchError((error) => {
        console.error('Failed to fetch transactions:', error);
        return throwError(() => error);
      })
    );
  }

  /** Deposit into the user’s account */
  deposit(amount: number): Observable<Transaction> {
    return this.put<Transaction, { amount: number }>(
      `${this.baseUrl}/mini-project/api/transactions/deposit`,
      { amount },
      undefined,
      { Authorization: `Bearer ${this.authService.getToken()}` }
    ).pipe(
      catchError((error) => {
        console.error('Deposit failed:', error);
        return throwError(() => error);
      })
    );
  }

  /** Withdraw from the user’s account */
  withdraw(amount: number): Observable<Transaction> {
    return this.put<Transaction, { amount: number }>(
      `${this.baseUrl}/mini-project/api/transactions/withdraw`,
      { amount },
      undefined,
      { Authorization: `Bearer ${this.authService.getToken()}` }
    ).pipe(
      catchError((error) => {
        console.error('Withdrawal failed:', error);
        return throwError(() => error);
      })
    );
  }

  /** Transfer to another user */
  transfer(username: string, amount: number): Observable<Transaction> {
    return this.put<Transaction, { amount: number }>(
      `${this.baseUrl}/mini-project/api/transactions/transfer/${username}`,
      { amount },
      undefined,
      { Authorization: `Bearer ${this.authService.getToken()}` }
    ).pipe(
      catchError((error) => {
        console.error(`Transfer to ${username} failed:`, error);
        return throwError(() => error);
      })
    );
  }
}
