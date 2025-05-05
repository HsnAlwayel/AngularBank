import { Component,signal } from '@angular/core';
import {TableModule} from 'primeng/table';
import {User}  from '../../interfaces/user';
import { CurrencyPipe } from '@angular/common';
import { UserService } from '../../services/user.service';
import { toSignal } from '@angular/core/rxjs-interop';
@Component({
  selector: 'app-users',
  standalone: true,
  imports: [TableModule, CurrencyPipe],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {
  constructor(private readonly userService: UserService) {}
  [x: string]: any;
  filters: any = {};
  // loading = true;
  // users$: any = signal([]);
  readonly users = toSignal(this.userService.getAllUsers(), { initialValue: [] });
  selectedUsers: User[] = [];
}
