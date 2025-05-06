import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule, TablePageEvent } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { Transaction } from '../../interfaces/transaction';
import { TransactionService } from '../../services/transaction.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    PaginatorModule,
    DropdownModule,
    CalendarModule,
    ToolbarModule,
    InputTextModule,
    ButtonModule,
  ],
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css'],
})
export class TransactionsComponent implements OnInit {
  transactions: Transaction[] = [];
  searchTerm = '';
  selectedType?: string;
  dateFrom?: Date;
  dateTo?: Date;
  filterOptions = [
    { label: 'All', value: undefined },
    { label: 'Deposit', value: 'deposit' },
    { label: 'Withdraw', value: 'withdraw' },
    { label: 'Transfer', value: 'transfer' },
  ];

  pageSize = 10;
  totalRecords = 0;
  loading = false;

  constructor(
    private transactionService: TransactionService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions(): void {
    this.loading = true;
    this.toastService.showInfo('Loading', 'Fetching your transactions...');

    this.transactionService
      .getMyTransactions({
        type: this.selectedType,
        dateFrom: this.dateFrom?.toISOString(),
        dateTo: this.dateTo?.toISOString(),
      })
      .subscribe({
        next: (data: Transaction[]) => {
          this.transactions = data;
          this.totalRecords = data.length;
          this.loading = false;
          this.toastService.showSuccess(
            'Transactions Loaded',
            `Found ${data.length} transactions`
          );
        },
        error: (err: any) => {
          console.error('Load failed', err);
          this.loading = false;
          this.toastService.showError(
            'Error',
            'Failed to load your transactions'
          );
        },
      });
  }

  onSearch(): void {
    this.toastService.showInfo('Filtering', 'Applying your filters...');
    this.loadTransactions();
  }

  onPageChange(event: TablePageEvent): void {
    this.pageSize = event.rows;
    this.loadTransactions();
  }
}
