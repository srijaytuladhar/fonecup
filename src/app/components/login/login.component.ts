import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthenticationService, private router: Router) { }

  async login() {
    if (!this.username.trim() || !this.password) {
      this.errorMessage = 'Username and password are required';
      return;
    }
    try {
      await this.authService.loginWithCredentials(this.username.trim(), this.password);
      this.router.navigate(['/leaderboard']);
    } catch (err:any) {
      this.errorMessage = err.message || 'Login failed';
    }
  }
}
