import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { User } from '../../interfaces/user';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { UserService } from '../../services/user.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { ButtonModule } from 'primeng/button';
import { ToastService } from '../../services/toast.service';
import { UserProfile } from '../../interfaces/auth/auth';
import { ModalComponent } from '../modal/modal.component';
import { BehaviorSubject, switchMap } from 'rxjs';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    CurrencyPipe,
    ButtonModule,
    ModalComponent,
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent implements OnInit {
  ModalVisible = false;
  selectedUser: User | null = null;
  currentUsername = '';

  private refreshTrigger = new BehaviorSubject<void>(undefined);

  readonly users = toSignal(
    this.refreshTrigger.pipe(switchMap(() => this.userService.getAllUsers())),
    { initialValue: [] }
  );

  constructor(
    private userService: UserService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.userService.getProfile().subscribe({
      next: (profile: UserProfile) => {
        this.currentUsername = profile.username;
      },
      error: (error) => {
        console.error('Failed to load profile:', error);
      },
    });
  }

  openTransferDialog(user: User): void {
    this.selectedUser = user;
    this.ModalVisible = true;
  }

  refreshUsers(): void {
    this.refreshTrigger.next();
  }
}
