import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { TransactionService } from '../../services/transaction.service';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { UserProfile } from '../../interfaces/auth/auth';
import { TagModule } from 'primeng/tag';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    TagModule,
    RouterModule,
    InputNumberModule,
    InputTextModule,
    DropdownModule,
    ReactiveFormsModule,
    MessagesModule,
    MessageModule,
  ],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  profile: UserProfile | null = null;
  transactionForm: FormGroup;
  transactionTypes = [
    { label: 'Deposit', value: 'deposit' },
    { label: 'Withdraw', value: 'withdraw' },
  ];
  isLoading = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private userService: UserService,
    private transactionService: TransactionService,
    private fb: FormBuilder,
    private toastService: ToastService
  ) {
    this.transactionForm = this.fb.group({
      type: ['deposit', Validators.required],
      amount: [0, [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.userService.getProfile().subscribe({
      next: (profile) => {
        this.profile = profile;
      },
      error: (error) => {
        console.error('Failed to load profile', error);
        this.toastService.showError(
          'Profile Error',
          'Failed to load your profile data'
        );
      },
    });
  }

  onSubmit(): void {
    if (this.transactionForm.invalid) return;

    this.isLoading = true;
    this.successMessage = '';
    this.errorMessage = '';

    const { type, amount } = this.transactionForm.value;

    if (type === 'deposit') {
      this.deposit(amount);
    } else if (type === 'withdraw') {
      this.withdraw(amount);
    }
  }

  deposit(amount: number): void {
    this.transactionService.deposit(amount).subscribe({
      next: (transaction) => {
        this.isLoading = false;
        this.successMessage = `Successfully deposited $${amount.toFixed(2)}`;
        this.toastService.showSuccess(
          'Deposit Successful',
          `$${amount.toFixed(2)} has been added to your account`
        );
        this.loadProfile(); // Refresh profile to show updated balance
        this.resetForm();
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage =
          error.error?.message || 'Deposit failed. Please try again.';
        this.toastService.showError('Deposit Failed', this.errorMessage);
      },
    });
  }

  withdraw(amount: number): void {
    this.transactionService.withdraw(amount).subscribe({
      next: (transaction) => {
        this.isLoading = false;
        this.successMessage = `Successfully withdrew $${amount.toFixed(2)}`;
        this.toastService.showSuccess(
          'Withdrawal Successful',
          `$${amount.toFixed(2)} has been withdrawn from your account`
        );
        this.loadProfile(); // Refresh profile to show updated balance
        this.resetForm();
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage =
          error.error?.message || 'Withdrawal failed. Please try again.';
        this.toastService.showError('Withdrawal Failed', this.errorMessage);
      },
    });
  }

  resetForm(): void {
    this.transactionForm.reset({
      type: 'deposit',
      amount: 0,
    });
  }
}
