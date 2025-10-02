import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  email = '';
  password = '';
  errorMessage = '';
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async onRegister() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Please fill all fields';
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const result = await this.authService.register(this.email, this.password);

    this.loading = false;

    if (result.success) {
      alert('✅ Registration successful! You are now logged in.');
      this.router.navigate(['/dashboard']);
    } else {
      this.errorMessage = this.getErrorMessage(result.error);
    }
  }

  getErrorMessage(error: string): string {
    if (error.includes('email-already-in-use')) return 'Email already exists';
    if (error.includes('invalid-email')) return 'Invalid email address';
    if (error.includes('weak-password')) return 'Password is too weak';
    return 'Registration failed. Please try again.';
  }
}
