import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { BaseService } from './base.service';
import { Transaction, TransactionRequest } from '../interfaces/transaction';

@Injectable({
  providedIn: 'root',
})
export class TransactionService extends BaseService {
  private readonly baseUrl = 'https://react-bank-project.eapi.joincoded.com';

  constructor(_http: HttpClient) {
    super(_http);
  }

  getMyTransactions(): Observable<Transaction[]> {
    return this.get<Transaction[]>(
      `${this.baseUrl}/mini-project/api/transactions/my`
    ).pipe(
      catchError((error) => {
        console.error('Failed to fetch transactions:', error);
        return throwError(() => error);
      })
    );
  }

  deposit(amount: number): Observable<Transaction> {
    return this.put<Transaction, TransactionRequest>(
      `${this.baseUrl}/mini-project/api/transactions/deposit`,
      { amount }
    ).pipe(
      catchError((error) => {
        console.error('Deposit failed:', error);
        return throwError(() => error);
      })
    );
  }

  withdraw(amount: number): Observable<Transaction> {
    return this.put<Transaction, TransactionRequest>(
      `${this.baseUrl}/mini-project/api/transactions/withdraw`,
      { amount }
    ).pipe(
      catchError((error) => {
        console.error('Withdrawal failed:', error);
        return throwError(() => error);
      })
    );
  }

  transfer(username: string, amount: number): Observable<Transaction> {
    return this.put<Transaction, TransactionRequest>(
      `${this.baseUrl}/mini-project/api/transactions/transfer/${username}`,
      { amount }
    ).pipe(
      catchError((error) => {
        console.error(`Transfer to ${username} failed:`, error);
        return throwError(() => error);
      })
    );
  }
}
