import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PredictionService, Match } from '../../services/prediction.service';
import { AuthenticationService, AuthUser } from '../../services/authentication.service';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.css'
})
export class AdminPanelComponent implements OnInit {
  users: AuthUser[] = [];
  newEmployeeName: string = '';
  newMatchTeamA: string = '';
  newMatchTeamB: string = '';
  newMatchDate: string = '';
  newMatchGroupName: string = '';
  
  scheduledMatches: Match[] = [];
  finalScores: { [matchId: string]: { scoreA: number, scoreB: number } } = {};

  editingUserId: string | null = null;
  editingName: string = '';
  editingUsername: string = '';
  editingPassword: string = '';
  editingIsPaid: boolean = false;

  constructor(private predictionService: PredictionService, public authService: AuthenticationService) {}

  ngOnInit() {
    this.predictionService.matches$.subscribe(matches => {
      this.scheduledMatches = matches.filter(m => m.status === 'scheduled');
      this.scheduledMatches.forEach(m => {
        if (!this.finalScores[m.id]) {
          this.finalScores[m.id] = { scoreA: 0, scoreB: 0 };
        }
      });
    });
    this.loadUsers();
  }

  loadUsers() {
    if (this.authService.isAdmin()) {
      this.authService.getAllUsers().then(users => this.users = users);
    }
  }

  startEdit(user: AuthUser) {
    this.editingUserId = user.id;
    this.editingName = user.name;
    this.editingUsername = user.username;
    this.editingPassword = user.password;
    this.editingIsPaid = !!user.isPaid;
  }

  cancelEdit() {
    this.editingUserId = null;
  }

  async saveUserEdit(userId: string) {
    if (!this.editingName.trim() || !this.editingUsername.trim() || !this.editingPassword.trim()) {
      alert('All fields are required.');
      return;
    }
    try {
      await this.authService.updateUserCredentials(userId, {
        name: this.editingName.trim(),
        username: this.editingUsername.trim(),
        password: this.editingPassword.trim(),
        isPaid: this.editingIsPaid
      });
      this.editingUserId = null;
      alert('User credentials updated successfully!');
      this.loadUsers();
    } catch (err: any) {
      alert('Error updating user: ' + err.message);
    }
  }

  async togglePaidStatus(user: AuthUser) {
    try {
      const newPaid = !user.isPaid;
      await this.authService.updateUserCredentials(user.id, {
        isPaid: newPaid
      });
      user.isPaid = newPaid;
      this.loadUsers();
    } catch (err: any) {
      alert('Error updating paid status: ' + err.message);
    }
  }

  addEmployee() {
    if (this.newEmployeeName.trim()) {
      this.predictionService.addUser(this.newEmployeeName.trim());
      this.newEmployeeName = '';
      alert('Employee added!');
    }
  }

  addMatch() {
    if (this.newMatchTeamA && this.newMatchTeamB && this.newMatchDate && this.newMatchGroupName) {
      this.predictionService.addMatch(this.newMatchTeamA, this.newMatchTeamB, this.newMatchDate, this.newMatchGroupName);
      this.newMatchTeamA = '';
      this.newMatchTeamB = '';
      this.newMatchDate = '';
      this.newMatchGroupName = '';
      alert('Match added!');
    }
  }

  toggleMatchBlock(matchId: string, currentStatus: boolean | undefined) {
    const nextStatus = !currentStatus;
    this.predictionService.toggleMatchBlock(matchId, nextStatus)
      .then(() => {
        alert(`Match predictions ${nextStatus ? 'blocked' : 'unblocked'} successfully!`);
      })
      .catch(err => {
        alert('Error updating block status: ' + err.message);
      });
  }

  resolveMatch(matchId: string) {
    const scores = this.finalScores[matchId];
    if (scores.scoreA >= 0 && scores.scoreB >= 0) {
      this.predictionService.resolveMatch(matchId, scores.scoreA, scores.scoreB);
      alert('Match resolved and points calculated!');
    }
  }

  resetAllData() {
    if (confirm('Are you sure you want to reset all data to default mock data? This cannot be undone.')) {
      this.predictionService.resetData();
      alert('Data has been reset successfully!');
    }
  }
}
