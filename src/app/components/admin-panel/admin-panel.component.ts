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
    // Load all user credentials if admin
    if (this.authService.isAdmin()) {
      this.authService.getAllUsers().then(users => this.users = users);
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
