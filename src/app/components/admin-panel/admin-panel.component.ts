import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PredictionService, Match, Prediction } from '../../services/prediction.service';
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
  allPredictions: Prediction[] = [];
  expandedPredictionStatus: { [matchId: string]: boolean } = {};

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
    this.predictionService.predictions$.subscribe(preds => {
      this.allPredictions = preds;
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

  async addEmployee() {
    if (this.newEmployeeName.trim()) {
      await this.predictionService.addUser(this.newEmployeeName.trim());
      this.newEmployeeName = '';
      alert('Employee added!');
      this.loadUsers();
    }
  }

  getParticipantsCount(): number {
    return this.users.filter(u => !u.isAdmin).length;
  }

  getPredictionCount(matchId: string): number {
    return this.allPredictions.filter(p => p.matchId === matchId).length;
  }

  togglePredictionStatus(matchId: string) {
    this.expandedPredictionStatus[matchId] = !this.expandedPredictionStatus[matchId];
  }

  getUserPredictionScore(matchId: string, userId: string) {
    const pred = this.allPredictions.find(p => p.matchId === matchId && p.userId === userId);
    return pred ? { scoreA: pred.predictedScoreA, scoreB: pred.predictedScoreB } : null;
  }

  getPredictionStatus(matchId: string) {
    const predicted: AuthUser[] = [];
    const notPredicted: AuthUser[] = [];
    const participants = this.users.filter(u => !u.isAdmin);
    participants.forEach(user => {
      const hasPred = this.allPredictions.some(p => p.matchId === matchId && p.userId === user.id);
      if (hasPred) {
        predicted.push(user);
      } else {
        notPredicted.push(user);
      }
    });
    return { predicted, notPredicted };
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

  async exportBackup() {
    try {
      const csvContent = await this.predictionService.exportData();
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `backup_${new Date().toISOString().slice(0, 10)}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err: any) {
      alert('Error exporting data: ' + err.message);
    }
  }

  async importBackup(event: any) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!confirm('Are you sure you want to restore this backup? This will overwrite all current data in the application and cannot be undone.')) {
      event.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e: any) => {
      const text = e.target.result;
      try {
        await this.predictionService.importData(text);
        alert('Backup restored successfully!');
        this.loadUsers();
        event.target.value = '';
      } catch (err: any) {
        alert('Error restoring backup: ' + err.message);
        event.target.value = '';
      }
    };
    reader.onerror = () => {
      alert('Failed to read file.');
      event.target.value = '';
    };
    reader.readAsText(file);
  }
}
