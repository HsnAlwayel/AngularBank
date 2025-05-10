import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError, Subject, tap } from 'rxjs';
import { BaseService } from './base.service';
import { Transaction, TransactionQuery } from '../interfaces/transaction';

@Injectable({
  providedIn: 'root',
})
export class TransactionService extends BaseService {
  private readonly baseUrl = 'https://react-bank-project.eapi.joincoded.com';

  // Add a refresh subject to notify components when data should be refreshed
  private refreshNeeded = new Subject<void>();

  // Expose an observable that components can subscribe to
  public refreshNeeded$ = this.refreshNeeded.asObservable();

  constructor(http: HttpClient) {
    super(http);
  }

  // Call this method to signal that data should be refreshed
  triggerRefresh() {
    this.refreshNeeded.next();
  }

  getMyTransactions(query?: TransactionQuery): Observable<Transaction[]> {
    const params: Record<string, any> = {};
    if (query?.type) params['type'] = query.type;
    if (query?.dateFrom) params['dateFrom'] = query.dateFrom;
    if (query?.dateTo) params['dateTo'] = query.dateTo;

    return this.get<Transaction[]>(
      `${this.baseUrl}/mini-project/api/transactions/my`,
      params
    ).pipe(
      catchError((error) => {
        console.error('Failed to fetch transactions:', error);
        return throwError(() => error);
      })
    );
  }

  deposit(amount: number): Observable<Transaction> {
    return this.put<Transaction, { amount: number }>(
      `${this.baseUrl}/mini-project/api/transactions/deposit`,
      { amount }
    ).pipe(
      tap(() => this.triggerRefresh()), // Trigger refresh after deposit
      catchError((error) => {
        console.error('Deposit failed:', error);
        return throwError(() => error);
      })
    );
  }

  withdraw(amount: number): Observable<Transaction> {
    return this.put<Transaction, { amount: number }>(
      `${this.baseUrl}/mini-project/api/transactions/withdraw`,
      { amount }
    ).pipe(
      tap(() => this.triggerRefresh()), // Trigger refresh after withdrawal
      catchError((error) => {
        console.error('Withdrawal failed:', error);
        return throwError(() => error);
      })
    );
  }

  transfer(username: string, amount: number): Observable<Transaction> {
    return this.put<Transaction, { amount: number }>(
      `${this.baseUrl}/mini-project/api/transactions/transfer/${username}`,
      { amount }
    ).pipe(
      tap(() => this.triggerRefresh()), // Trigger refresh after transfer
      catchError((error) => {
        console.error(`Transfer to ${username} failed:`, error);
        return throwError(() => error);
      })
    );
  }
}
