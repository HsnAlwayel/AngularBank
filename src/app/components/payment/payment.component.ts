import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { UserService } from '../../services/user.service';
import { TransactionService } from '../../services/transaction.service';
import { ToastService } from '../../services/toast.service';
import { User } from '../../interfaces/user';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputNumberModule,
    CardModule,
    InputTextModule,
    RouterModule,
  ],
  templateUrl: './payment.component.html',
})
export class PaymentComponent implements OnInit {
  amount: number = 0;
  recipient: string = '';
  isCreator: boolean = false;
  loading: boolean = false;
  recipientUser: User | null = null;
  currentUsername: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private transactionService: TransactionService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    // Get URL parameters
    this.route.queryParams.subscribe((params) => {
      this.recipient = params['to'] || '';
      this.amount = Number(params['amount']) || 0;

      // Get current user's profile
      this.userService.getProfile().subscribe({
        next: (profile) => {
          this.currentUsername = profile.username;

          // If there's no recipient in the URL, we're creating a new payment link
          if (!this.recipient) {
            this.isCreator = true;
          } else {
            // If there is a recipient, check if current user is that recipient
            this.isCreator = this.recipient === this.currentUsername;

            // If not creator, fetch recipient details
            if (!this.isCreator && this.recipient) {
              this.fetchRecipientDetails();
            }
          }
        },
        error: (error) => {
          this.toastService.showError('Error', 'Failed to load user profile');
        },
      });
    });
  }

  fetchRecipientDetails(): void {
    // We need to get details about the recipient to display
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        const foundUser = users.find(
          (user) => user.username === this.recipient
        );
        if (foundUser) {
          this.recipientUser = foundUser;
        } else {
          this.toastService.showError('Error', 'Recipient user not found');
        }
      },
      error: (error) => {
        this.toastService.showError(
          'Error',
          'Failed to load recipient details'
        );
      },
    });
  }

  generatePaymentLink(): void {
    if (this.amount <= 0) {
      this.toastService.showError(
        'Invalid Amount',
        'Please enter a valid amount'
      );
      return;
    }

    // Create payment link with current user as recipient
    const paymentLink = `${window.location.origin}/payment?to=${this.currentUsername}&amount=${this.amount}`;

    // Copy to clipboard
    navigator.clipboard
      .writeText(paymentLink)
      .then(() => {
        this.toastService.showSuccess(
          'Success',
          'Payment link copied to clipboard!'
        );
      })
      .catch(() => {
        this.toastService.showError('Error', 'Failed to copy link');
      });
  }

  processPayment(): void {
    if (this.amount <= 0) {
      this.toastService.showError(
        'Invalid Amount',
        'Please enter a valid amount'
      );
      return;
    }

    this.loading = true;
    this.transactionService.transfer(this.recipient, this.amount).subscribe({
      next: (response) => {
        this.loading = false;
        this.toastService.showSuccess(
          'Transfer Complete',
          `Successfully transferred ${this.amount} to ${this.recipient}`
        );
        this.router.navigate(['/home']);
      },
      error: (error) => {
        this.loading = false;
        this.toastService.showError(
          'Transfer Failed',
          error.error?.message || 'Failed to complete transfer'
        );
      },
    });
  }
}
