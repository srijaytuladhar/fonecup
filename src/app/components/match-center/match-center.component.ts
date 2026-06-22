import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PredictionService, Match, Employee, Prediction } from '../../services/prediction.service';
import { AuthenticationService } from '../../services/authentication.service';
import { ToastService } from '../../services/toast.service';

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
  filter: 'all' | 'scheduled' | 'completed' = 'scheduled';
  selectedGroup: string = 'all';

  selectedUserId: string = '';
  currentUserName: string = '';
  tempPredictions: { [matchId: string]: { scoreA: number, scoreB: number } } = {};
  saveFeedback: { [matchId: string]: boolean } = {};

  constructor(
    private predictionService: PredictionService,
    private authService: AuthenticationService,
    private router: Router,
    private toastService: ToastService
  ) { }

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

  get completedMatchesCount(): number {
    return this.matches.filter(m => m.status === 'completed').length;
  }

  get scheduledMatchesCount(): number {
    return this.matches.filter(m => m.status === 'scheduled').length;
  }

  get allMatchesCount(): number {
    return this.matches.length;
  }

  get filteredMatches() {
    let filtered = this.matches;
    if (this.filter !== 'all') {
      filtered = filtered.filter(m => m.status === this.filter);
    }
    if (this.selectedGroup !== 'all') {
      filtered = filtered.filter(m => m.groupName === this.selectedGroup);
    }
    if (this.filter === 'completed') {
      return [...filtered].sort((a, b) => new Date(b.matchDate).getTime() - new Date(a.matchDate).getTime());
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

  async adjustScore(matchId: string, team: 'scoreA' | 'scoreB', amount: number) {
    if (!this.tempPredictions[matchId]) return;
    const current = this.tempPredictions[matchId][team];
    const updated = current + amount;
    if (updated >= 0) {
      this.tempPredictions[matchId][team] = updated;
      await this.saveAutoPrediction(matchId);
    }
  }

  async saveAutoPrediction(matchId: string) {
    if (!this.authService.isLoggedIn()) {
      this.toastService.error('Please log in before submitting predictions.');
      this.router.navigate(['/login']);
      return;
    }
    if (!this.selectedUserId) return;
    const scores = this.tempPredictions[matchId];
    try {
      await this.predictionService.savePrediction(this.selectedUserId, matchId, scores.scoreA, scores.scoreB);
    } catch (err: any) {
      this.toastService.error('Error saving prediction: ' + err.message);
    }
  }

  async setPredictionToZero(matchId: string) {
    if (!this.tempPredictions[matchId]) return;
    this.tempPredictions[matchId].scoreA = 0;
    this.tempPredictions[matchId].scoreB = 0;
    await this.saveAutoPrediction(matchId);

    // Show visual indicator feedback for 1.5 seconds
    this.saveFeedback[matchId] = true;
    setTimeout(() => {
      this.saveFeedback[matchId] = false;
    }, 1500);
  }

  getPredictionForMatch(matchId: string, userId: string) {
    return this.predictions.find(p => p.matchId === matchId && p.userId === userId);
  }

  isPredictionZeroZero(matchId: string): boolean {
    const pred = this.getPredictionForMatch(matchId, this.selectedUserId);
    return !!pred && pred.predictedScoreA === 0 && pred.predictedScoreB === 0;
  }

  getDateLabel(matchDateString: string): 'today' | 'tomorrow' | null {
    if (!matchDateString) return null;
    const matchDate = new Date(matchDateString);
    if (isNaN(matchDate.getTime())) return null;

    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    const isSameDay = (d1: Date, d2: Date) =>
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate();

    if (isSameDay(matchDate, today)) {
      return 'today';
    } else if (isSameDay(matchDate, tomorrow)) {
      return 'tomorrow';
    }
    return null;
  }

  isLiveWindow(matchDateString: string): boolean {
    if (!matchDateString) return false;
    const matchDate = new Date(matchDateString);
    if (isNaN(matchDate.getTime())) return false;

    const currentTime = new Date().getTime();
    const oneHourBefore = matchDate.getTime() - (60 * 60 * 1000);
    const twoHoursAfter = matchDate.getTime() + (2 * 60 * 60 * 1000);

    return currentTime >= oneHourBefore && currentTime <= twoHoursAfter;
  }

  isMatchBlocked(match: Match): boolean {
    if (!match) return false;
    return !!match.isBlocked || (new Date().getTime() >= new Date(match.matchDate).getTime());
  }
}
