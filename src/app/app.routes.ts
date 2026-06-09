import { Routes } from '@angular/router';
import { LeaderboardComponent } from './components/leaderboard/leaderboard.component';
import { MatchCenterComponent } from './components/match-center/match-center.component';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'leaderboard', component: LeaderboardComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'matches', component: MatchCenterComponent, canActivate: [AuthGuard] },
  { path: 'admin', component: AdminPanelComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/leaderboard' }
];
