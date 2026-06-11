import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PredictionService, Employee, PoolRules } from '../../services/prediction.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './leaderboard.component.html',
  styleUrl: './leaderboard.component.css'
})
export class LeaderboardComponent implements OnInit {
  employees: Employee[] = [];
  remainingPool = 0;

  constructor(private predictionService: PredictionService) {}

  ngOnInit() {
    this.predictionService.users$.subscribe(users => {
      this.employees = [...users].sort((a, b) => b.totalPoints - a.totalPoints);
      this.updateRemainingPool();
    });
    this.predictionService.matches$.subscribe(() => {
      this.updateRemainingPool();
    });
  }

  updateRemainingPool() {
    this.remainingPool = this.predictionService.getRemainingPool();
  }

  getFlag(teamName: string): string {
    return this.predictionService.getFlag(teamName);
  }
}
