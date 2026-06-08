import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PredictionService, Match, Employee, Prediction } from '../../services/prediction.service';

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
  
  selectedUserId: string = '';
  tempPredictions: { [matchId: string]: { scoreA: number, scoreB: number } } = {};

  constructor(private predictionService: PredictionService) {}

  ngOnInit() {
    this.predictionService.matches$.subscribe(m => this.matches = m);
    this.predictionService.users$.subscribe(u => {
      this.employees = u;
      if (u.length > 0 && !this.selectedUserId) {
        this.selectedUserId = u[0].id;
      }
      this.loadUserPredictions();
    });
    this.predictionService.predictions$.subscribe(p => {
      this.predictions = p;
      this.loadUserPredictions();
    });
  }

  get filteredMatches() {
    if (this.filter === 'all') return this.matches;
    return this.matches.filter(m => m.status === this.filter);
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

  savePrediction(matchId: string) {
    if (!this.selectedUserId) return;
    const scores = this.tempPredictions[matchId];
    this.predictionService.savePrediction(this.selectedUserId, matchId, scores.scoreA, scores.scoreB);
    alert('Prediction saved!');
  }

  getPredictionForMatch(matchId: string, userId: string) {
    return this.predictions.find(p => p.matchId === matchId && p.userId === userId);
  }
}
