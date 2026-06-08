import { Routes } from '@angular/router';
import { LeaderboardComponent } from './components/leaderboard/leaderboard.component';
import { MatchCenterComponent } from './components/match-center/match-center.component';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';

export const routes: Routes = [
  { path: 'leaderboard', component: LeaderboardComponent },
  { path: 'matches', component: MatchCenterComponent },
  { path: 'admin', component: AdminPanelComponent },
  { path: '', redirectTo: '/leaderboard', pathMatch: 'full' },
  { path: '**', redirectTo: '/leaderboard' }
];
