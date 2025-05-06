import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';

import { finalize } from 'rxjs';
import { User } from '../../interfaces/user';
import { ToastService } from '../../services/toast.service';
import { TransactionService } from '../../services/transaction.service';

@Component({
  selector: 'app-transfer-dialog',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    ButtonModule,
    InputNumberModule,
    FormsModule,
  ],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
})
export class ModalComponent implements OnChanges {
  @Input() visible = false;
  @Input() targetUser: User | null = null;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() transferComplete = new EventEmitter<void>();

  transferAmount: number = 0;
  isTransferring = false;

  constructor(
    private transactionService: TransactionService,
    private toastService: ToastService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible'] && changes['visible'].currentValue === true) {
      // Reset the form when dialog opens
      this.transferAmount = 0;
    }
  }

  hide(): void {
    this.visibleChange.emit(false);
  }

  cancelTransfer(): void {
    this.hide();
  }

  confirmTransfer(): void {
    if (!this.targetUser || this.transferAmount <= 0) {
      this.toastService.showError(
        'Invalid Transfer',
        'Please enter a valid amount'
      );
      return;
    }

    this.isTransferring = true;
    this.toastService.showInfo('Processing', 'Processing your transfer...');

    this.transactionService
      .transfer(this.targetUser.username, this.transferAmount)
      .pipe(
        finalize(() => {
          this.isTransferring = false;
        })
      )
      .subscribe({
        next: () => {
          this.toastService.showSuccess(
            'Transfer Successful',
            `Successfully transferred KWD ${this.transferAmount} to ${this.targetUser?.username}`
          );
          this.hide();
          this.transferComplete.emit();
        },
        error: (error) => {
          console.error('Transfer failed:', error);
          this.toastService.showError(
            'Transfer Failed',
            error.error?.message ||
              'Failed to transfer money. Please try again.'
          );
        },
      });
  }
}
