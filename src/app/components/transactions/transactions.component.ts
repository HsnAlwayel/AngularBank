import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { Transaction } from '../../interfaces/transaction';
import { TransactionService } from '../../services/transaction.service';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    CalendarModule,
    RadioButtonModule,
    InputTextModule,
    ButtonModule,
  ],
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css'],
})
export class TransactionsComponent implements OnInit {
  // Data and filters
  transactions: Transaction[] = [];
  searchTerm = '';
  filter: 'all' | 'deposit' | 'withdraw' | 'transfer' | 'date' = 'all';
  dateFrom: Date | null = null;
  dateTo: Date | null = null;

  constructor(private transactionService: TransactionService) {}

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions(): void {
    this.transactionService.getMyTransactions().subscribe({
      next: (data) => (this.transactions = data),
      error: (err) => console.error('Load failed', err),
    });
  }

  onSearch(): void {
    // To DO: implement search logic against API or filter locally
    this.loadTransactions();
  }
}
