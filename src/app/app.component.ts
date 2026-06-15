import { Component } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthenticationService } from './services/authentication.service';
import { PredictionService } from './services/prediction.service';
import { ToastService } from './services/toast.service';

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
  audio: HTMLAudioElement | null = null;
  isPlaying = false;

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
    private predictionService: PredictionService,
    public toastService: ToastService
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = event.urlAfterRedirects;
      }
    });

    let previousUser: any = null;
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user && !previousUser) {
        this.playWavinFlag();
      } else if (!user && this.audio) {
        this.audio.pause();
        this.isPlaying = false;
      }
      previousUser = user;
    });
  }

  playWavinFlag() {
    if (!this.audio) {
      this.audio = new Audio('https://archive.org/download/2010-various-artists-the-dome-summer-2010/03.%20K%27naan%20-%20Wavin%27%20flag.mp3');
      this.audio.volume = 0.35;
      this.audio.loop = true;
      this.audio.preload = 'auto';
    }

    const tryPlay = () => {
      if (this.currentUser && this.audio && !this.isPlaying) {
        this.audio.play()
          .then(() => {
            this.isPlaying = true;
            removeListeners();
          })
          .catch(e => console.log("Play failed on interaction:", e));
      } else {
        removeListeners();
      }
    };

    const removeListeners = () => {
      window.removeEventListener('click', tryPlay);
      window.removeEventListener('keydown', tryPlay);
      window.removeEventListener('touchstart', tryPlay);
      window.removeEventListener('mousedown', tryPlay);
      document.removeEventListener('click', tryPlay);
      document.removeEventListener('keydown', tryPlay);
      document.removeEventListener('touchstart', tryPlay);
      document.removeEventListener('mousedown', tryPlay);
    };

    this.audio.play()
      .then(() => {
        this.isPlaying = true;
      })
      .catch(err => {
        console.log("Autoplay blocked, waiting for user gesture:", err);
        window.addEventListener('click', tryPlay);
        window.addEventListener('keydown', tryPlay);
        window.addEventListener('touchstart', tryPlay);
        window.addEventListener('mousedown', tryPlay);
        document.addEventListener('click', tryPlay);
        document.addEventListener('keydown', tryPlay);
        document.addEventListener('touchstart', tryPlay);
        document.addEventListener('mousedown', tryPlay);
      });
  }

  toggleAudio() {
    if (!this.audio) return;
    if (this.isPlaying) {
      this.audio.pause();
      this.isPlaying = false;
    } else {
      this.audio.play()
        .then(() => {
          this.isPlaying = true;
        })
        .catch(err => {
          console.log("Failed to play audio:", err);
        });
    }
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
      this.toastService.error('Please select a country!');
      return;
    }
    if (!this.currentUser) {
      this.toastService.error('Please login first!');
      return;
    }
    try {
      await this.authService.saveChampionPrediction(this.currentUser.id, this.selectedChampion);
      this.toastService.success('Champion prediction saved successfully!');
      this.closeChampionModal();
    } catch (err) {
      console.error(err);
      this.toastService.error('Failed to save champion prediction.');
    }
  }

  logout() {
    if (this.audio) {
      this.audio.pause();
      this.isPlaying = false;
    }
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
