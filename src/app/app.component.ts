import { Component } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthenticationService } from './services/authentication.service';
import { PredictionService } from './services/prediction.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'fonepay-worldcup';
  currentUrl = '';
  currentUser: any = null;

  isChampionModalOpen = false;
  selectedChampion = '';

  groups = {
    'Group A': ['Mexico', 'South Africa', 'Korea Republic', 'Czechia'],
    'Group B': ['Canada', 'Bosnia and Herzegovina', 'Qatar', 'Switzerland'],
    'Group C': ['Brazil', 'Morocco', 'Haiti', 'Scotland'],
    'Group D': ['USA', 'Paraguay', 'Australia', 'Türkiye'],
    'Group E': ['Germany', 'Curaçao', 'Côte d\'Ivoire', 'Ecuador'],
    'Group F': ['Netherlands', 'Japan', 'Sweden', 'Tunisia'],
    'Group G': ['Belgium', 'Egypt', 'IR Iran', 'New Zealand'],
    'Group H': ['Spain', 'Cabo Verde', 'Saudi Arabia', 'Uruguay'],
    'Group I': ['France', 'Senegal', 'Iraq', 'Norway'],
    'Group J': ['Argentina', 'Algeria', 'Austria', 'Jordan'],
    'Group K': ['Portugal', 'Congo DR', 'Uzbekistan', 'Colombia'],
    'Group L': ['England', 'Croatia', 'Ghana', 'Panama']
  };

  constructor(
    public router: Router, 
    private authService: AuthenticationService,
    private predictionService: PredictionService
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = event.urlAfterRedirects;
      }
    });
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  getFlag(teamName: string): string {
    return this.predictionService.getFlag(teamName);
  }

  openChampionModal() {
    this.selectedChampion = this.currentUser?.championPrediction || '';
    this.isChampionModalOpen = true;
  }

  closeChampionModal() {
    this.isChampionModalOpen = false;
  }

  selectTeam(teamName: string) {
    this.selectedChampion = teamName;
  }

  async saveChampionSelection() {
    if (!this.selectedChampion) {
      alert('Please select a country!');
      return;
    }
    if (!this.currentUser) {
      alert('Please login first!');
      return;
    }
    try {
      await this.authService.saveChampionPrediction(this.currentUser.id, this.selectedChampion);
      this.closeChampionModal();
    } catch (err) {
      console.error(err);
      alert('Failed to save champion prediction.');
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
