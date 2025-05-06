import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(private messageService: MessageService) {}

  showSuccess(summary: string, detail?: string, sticky: boolean = false): void {
    this.messageService.add({
      severity: 'success',
      summary,
      detail,
      life: sticky ? 0 : 3000,
    });
  }

  showError(summary: string, detail?: string, sticky: boolean = true): void {
    this.messageService.add({
      severity: 'error',
      summary,
      detail,
      life: sticky ? 0 : 3000,
    });
  }

  showInfo(summary: string, detail?: string, sticky: boolean = false): void {
    this.messageService.add({
      severity: 'info',
      summary,
      detail,
      life: sticky ? 0 : 3000,
    });
  }

  showWarning(summary: string, detail?: string, sticky: boolean = false): void {
    this.messageService.add({
      severity: 'warn',
      summary,
      detail,
      life: sticky ? 0 : 3000,
    });
  }

  clear(): void {
    this.messageService.clear();
  }
}
