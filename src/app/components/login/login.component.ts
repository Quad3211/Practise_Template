import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async onLogin() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Please fill all fields';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const result = await this.authService.login(this.email, this.password);

    this.loading = false;

    if (result.success) {
      this.router.navigate(['/dashboard']);
    } else {
      this.errorMessage = this.getErrorMessage(result.error);
    }
  }

  getErrorMessage(error: string): string {
    if (error.includes('user-not-found')) return 'User not found';
    if (error.includes('wrong-password')) return 'Wrong password';
    if (error.includes('invalid-credential')) return 'Invalid email or password';
    return 'Login failed. Please try again.';
  }
}
