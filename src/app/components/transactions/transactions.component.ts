import { Component, OnInit, OnDestroy } from '@angular/core';
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
import { UserService } from '../../services/user.service';
import { forkJoin, Subscription } from 'rxjs';
import { User } from '../../interfaces/user';

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
export class TransactionsComponent implements OnInit, OnDestroy {
  allTransactions: Transaction[] = [];
  transactions: Transaction[] = [];
  userMap: { [key: string]: string } = {}; // Map user IDs to usernames

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

  /** Pagination  */
  pageSize = 10;
  totalRecords = 0;

  // Add subscription to manage unsubscribing
  private refreshSubscription: Subscription;

  constructor(
    private transactionService: TransactionService,
    private userService: UserService
  ) {
    // Subscribe to refresh events
    this.refreshSubscription = this.transactionService.refreshNeeded$.subscribe(
      () => {
        this.loadData();
      }
    );
  }

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    // Clean up subscription when component is destroyed
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  loadData(): void {
    // Load both transactions and users in parallel
    forkJoin({
      transactions: this.transactionService.getMyTransactions(),
      users: this.userService.getAllUsers(),
    }).subscribe({
      next: (result) => {
        // Create a map of user IDs to usernames
        this.userMap = {};
        result.users.forEach((user) => {
          this.userMap[user._id] = user.username;
        });

        this.allTransactions = result.transactions;
        this.applyFilters();
      },
      error: (err) => console.error('Load failed', err),
    });
  }

  // Get username from userId
  getUsernameById(userId: string): string {
    return this.userMap[userId] || 'Unknown User';
  }

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

  onSearch(): void {
    this.applyFilters();
  }

  onPageChange(event: TablePageEvent): void {
    this.pageSize = event.rows;
    this.applyFilters();
  }

  clearFilters(): void {
    this.selectedType = null;
    this.dateFrom = undefined;
    this.dateTo = undefined;
    this.minAmount = undefined;
    this.maxAmount = undefined;
    this.applyFilters();
  }
}
