import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthenticationService } from './services/authentication.service';
import { PredictionService } from './services/prediction.service';
import { ToastService } from './services/toast.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'fonepay-worldcup';
  currentUrl = '';
  currentUser: any = null;

  championSelectEnabled = true;
  countdownText = '';
  isTimeUp = false;
  private countdownInterval: any;
  private settingsSub?: Subscription;
  private routerSub?: Subscription;
  private userSub?: Subscription;

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

  songs = [
    { name: "Wavin' Flag", src: 'https://archive.org/download/2010-various-artists-the-dome-summer-2010/03.%20K%27naan%20-%20Wavin%27%20flag.mp3' },
    { name: "The Cup of Life", src: '/Ricky%20Martin%20-%20The%20Cup%20of%20Life.mp3' },
    { name: "Waka Waka", src: 'https://archive.org/download/waka-waka/Waka%20Waka.mp3' },
    { name: "Khoi kun geet ho yo?", src: 'https://archive.org/download/2010-various-artists-the-dome-summer-2010/05.%20Velile%20%26%20Safri%20Duo%20-%20Helele.mp3' },
    { name: "We Are the Champions", src: '/queen-we-are-the-champions-lyrics_NRwtZcI6.mp3' },
    { name: "Dai Dai", src: '/dai-dai.mp3' }
  ];
  currentSongIndex = 0;

  constructor(
    public router: Router,
    private authService: AuthenticationService,
    private predictionService: PredictionService,
    public toastService: ToastService
  ) {
    this.routerSub = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = event.urlAfterRedirects;
      }
    });

    let previousUser: any = null;
    this.userSub = this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user && !previousUser) {
        this.currentSongIndex = Math.floor(Math.random() * this.songs.length);
        this.playCurrentSong();
      } else if (!user && this.audio) {
        this.audio.pause();
        this.isPlaying = false;
      }
      previousUser = user;
    });

    this.settingsSub = this.predictionService.settings$.subscribe(settings => {
      this.championSelectEnabled = settings.championSelectEnabled;
    });
  }

  ngOnInit() {
    this.startCountdown();
  }

  ngOnDestroy() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
    this.settingsSub?.unsubscribe();
    this.routerSub?.unsubscribe();
    this.userSub?.unsubscribe();
  }

  isChampionSelectDisabled(): boolean {
    return !this.championSelectEnabled || this.isTimeUp;
  }

  startCountdown() {
    const targetTime = new Date('2026-07-10T01:45:00+05:45').getTime();
    
    const update = () => {
      const now = new Date().getTime();
      const diff = targetTime - now;
      
      if (diff <= 0) {
        this.countdownText = 'Closed';
        this.isTimeUp = true;
        if (this.countdownInterval) {
          clearInterval(this.countdownInterval);
        }
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        this.countdownText = `${hours}h ${minutes}m ${seconds}s`;
        this.isTimeUp = false;
      }
    };
    
    update();
    this.countdownInterval = setInterval(update, 1000);
  }

  playCurrentSong() {
    if (this.audio) {
      this.audio.pause();
      this.audio.src = '';
      this.audio = null;
    }

    const song = this.songs[this.currentSongIndex];
    this.audio = new Audio(song.src);
    this.audio.volume = 0.35;
    this.audio.preload = 'auto';

    this.audio.addEventListener('timeupdate', () => {
      if (this.audio && this.audio.currentTime >= 50) {
        this.playNextSong();
      }
    });

    this.audio.addEventListener('ended', () => {
      this.playNextSong();
    });

    let hasToasted = false;
    const showSongToast = () => {
      if (!hasToasted) {
        hasToasted = true;
        this.toastService.info(`🎵 Now Playing: ${song.name}`, 8000);
      }
    };

    const tryPlay = () => {
      if (this.currentUser && this.audio && !this.isPlaying) {
        this.audio.play()
          .then(() => {
            this.isPlaying = true;
            showSongToast();
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
        showSongToast();
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

  playNextSong() {
    let newIndex = this.currentSongIndex;
    if (this.songs.length > 1) {
      while (newIndex === this.currentSongIndex) {
        newIndex = Math.floor(Math.random() * this.songs.length);
      }
    } else {
      newIndex = 0;
    }
    this.currentSongIndex = newIndex;
    this.isPlaying = false;
    this.playCurrentSong();
  }

  toggleAudio() {
    if (!this.audio) {
      this.playCurrentSong();
      return;
    }
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
    if (this.isChampionSelectDisabled()) {
      this.toastService.error('Champion prediction is currently disabled or closed.');
      return;
    }
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
    if (this.isChampionSelectDisabled()) {
      this.toastService.error('Champion prediction is closed.');
      return;
    }
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
