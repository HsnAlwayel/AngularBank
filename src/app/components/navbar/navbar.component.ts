import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule, MenubarModule],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  constructor(
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {}

  logout(): void {
    this.authService.logout();
    this.toastService.showInfo(
      'Logged Out',
      'You have been successfully logged out'
    );
    this.router.navigate(['/login']);
  }
}
