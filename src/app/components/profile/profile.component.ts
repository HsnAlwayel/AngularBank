import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, DialogModule, ToastModule],
  providers: [MessageService],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  // User data
  username = '';
  userId = '';
  balance = 0;
  profileImage = '';

  // UI states
  isLoading = false;
  showDialog = false;
  selectedFile: any = null;
  imagePreview: any = null;

  constructor(
    private userService: UserService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  // Load user profile data
  loadProfile(): void {
    this.isLoading = true;

    this.userService.getProfile().subscribe({
      next: (data) => {
        this.username = data.username;
        this.userId = data._id;
        this.balance = data.balance;
        this.profileImage = data.image || '';
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading profile:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Could not load your profile',
        });
        this.isLoading = false;
      },
    });
  }

  // Open the image upload dialog
  openImageDialog(): void {
    this.showDialog = true;
    this.selectedFile = null;
    this.imagePreview = null;
  }

  // Handle file selection
  onFileSelect(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      // Create a preview of the selected image
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target?.result;
      };
      reader.readAsDataURL(file);
    }
  }

  // Upload the new profile image
  uploadImage(): void {
    if (!this.selectedFile) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please select an image first',
      });
      return;
    }

    this.isLoading = true;

    // Create form data with the image
    const formData = new FormData();
    formData.append('image', this.selectedFile);

    // Send the update request
    this.userService.updateProfile(formData).subscribe({
      next: (data) => {
        // Update the local profile image
        this.profileImage = data.image || '';

        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Profile picture updated successfully',
        });

        this.isLoading = false;
        this.showDialog = false;
      },
      error: (error) => {
        console.error('Error uploading image:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Could not update profile picture',
        });
        this.isLoading = false;
      },
    });
  }

  // Cancel and close the dialog
  cancelUpload(): void {
    this.showDialog = false;
    this.selectedFile = null;
    this.imagePreview = null;
  }

  // Helper to get first letter of username for avatar
  getInitial(): string {
    return this.username ? this.username.charAt(0).toUpperCase() : '?';
  }
}
