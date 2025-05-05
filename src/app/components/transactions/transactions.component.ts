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
  /** All transactions from API */
  allTransactions: Transaction[] = [];
  /** Filtered transactions to display */
  transactions: Transaction[] = [];

  /** UI filter state */
  selectedType: string | null = null;
  dateFrom?: Date;
  dateTo?: Date;
  minAmount?: number;
  maxAmount?: number;
  filterOptions = [
    { label: 'All', value: null },
    { label: 'Deposit', value: 'deposit' },
    { label: 'Withdraw', value: 'withdraw' },
    { label: 'Transfer', value: 'transfer' },
  ];

  /** Pagination state */
  pageSize = 10;
  totalRecords = 0;

  constructor(private transactionService: TransactionService) {}

  ngOnInit(): void {
    this.transactionService.getMyTransactions().subscribe({
      next: (data) => {
        this.allTransactions = data;
        this.applyFilters();
      },
      error: (err) => console.error('Load failed', err),
    });
  }

  /** Compute filtered list based on UI state */
  applyFilters(): void {
    this.transactions = this.allTransactions.filter((tx) => {
      let ok = true;
      const txDate = new Date(tx.createdAt);

      if (this.selectedType != null) {
        ok = ok && tx.type === this.selectedType;
      }
      if (this.dateFrom) {
        const start = new Date(this.dateFrom);
        start.setHours(0, 0, 0, 0);
        ok = ok && txDate >= start;
      }
      if (this.dateTo) {
        const end = new Date(this.dateTo);
        end.setHours(23, 59, 59, 999);
        ok = ok && txDate <= end;
      }
      if (this.minAmount != null) {
        ok = ok && tx.amount >= this.minAmount;
      }
      if (this.maxAmount != null) {
        ok = ok && tx.amount <= this.maxAmount;
      }
      return ok;
    });
    this.totalRecords = this.transactions.length;
  }

  /** Called when any filter input changes */
  onSearch(): void {
    this.applyFilters();
  }

  /** Handle pagination events */
  onPageChange(event: TablePageEvent): void {
    this.pageSize = event.rows;
    this.applyFilters();
  }

  /** Clear all filters and show all transactions */
  clearFilters(): void {
    this.selectedType = null;
    this.dateFrom = undefined;
    this.dateTo = undefined;
    this.minAmount = undefined;
    this.maxAmount = undefined;
    this.applyFilters();
  }
}
