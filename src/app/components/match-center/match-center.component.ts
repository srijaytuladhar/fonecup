import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PredictionService, Match, Employee, Prediction } from '../../services/prediction.service';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-match-center',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './match-center.component.html',
  styleUrl: './match-center.component.css'
})
export class MatchCenterComponent implements OnInit {
  matches: Match[] = [];
  employees: Employee[] = [];
  predictions: Prediction[] = [];
  filter: 'all' | 'scheduled' | 'completed' = 'all';
  selectedGroup: string = 'all';
  
  selectedUserId: string = '';
  currentUserName: string = '';
  tempPredictions: { [matchId: string]: { scoreA: number, scoreB: number } } = {};

  constructor(private predictionService: PredictionService, private authService: AuthenticationService, private router: Router) {}

  ngOnInit() {
    this.predictionService.matches$.subscribe(m => this.matches = m);
    this.predictionService.users$.subscribe(u => {
      this.employees = u;
      const currentUser = this.authService.getCurrentUser();
      if (currentUser) {
        this.selectedUserId = currentUser.id;
        this.currentUserName = currentUser.name;
      } else if (u.length > 0 && !this.selectedUserId) {
        this.selectedUserId = u[0].id;
        const matchedEmp = u.find(emp => emp.id === this.selectedUserId);
        this.currentUserName = matchedEmp ? matchedEmp.name : '';
      }
      this.loadUserPredictions();
    });
    this.predictionService.predictions$.subscribe(p => {
      this.predictions = p;
      this.loadUserPredictions();
    });
  }

  get groups(): string[] {
    const allGroups = this.matches.map(m => m.groupName).filter(Boolean);
    return Array.from(new Set(allGroups)).sort();
  }

  get filteredMatches() {
    let filtered = this.matches;
    if (this.filter !== 'all') {
      filtered = filtered.filter(m => m.status === this.filter);
    }
    if (this.selectedGroup !== 'all') {
      filtered = filtered.filter(m => m.groupName === this.selectedGroup);
    }
    return filtered;
  }

  onUserChange() {
    this.loadUserPredictions();
  }

  loadUserPredictions() {
    this.tempPredictions = {};
    if (!this.selectedUserId) return;
    
    const userPreds = this.predictions.filter(p => p.userId === this.selectedUserId);
    this.matches.filter(m => m.status === 'scheduled').forEach(m => {
      const existing = userPreds.find(p => p.matchId === m.id);
      this.tempPredictions[m.id] = {
        scoreA: existing ? existing.predictedScoreA : 0,
        scoreB: existing ? existing.predictedScoreB : 0
      };
    });
  }

  adjustScore(matchId: string, team: 'scoreA' | 'scoreB', amount: number) {
    if (!this.tempPredictions[matchId]) return;
    const current = this.tempPredictions[matchId][team];
    const updated = current + amount;
    if (updated >= 0) {
      this.tempPredictions[matchId][team] = updated;
    }
  }

  savePrediction(matchId: string) {
    if (!this.authService.isLoggedIn()) {
      alert('Please log in before submitting predictions.');
      this.router.navigate(['/login']);
      return;
    }
    if (!this.selectedUserId) return;
    const scores = this.tempPredictions[matchId];
    this.predictionService.savePrediction(this.selectedUserId, matchId, scores.scoreA, scores.scoreB);
    alert('Prediction saved!');
  }

  getPredictionForMatch(matchId: string, userId: string) {
    return this.predictions.find(p => p.matchId === matchId && p.userId === userId);
  }
}
