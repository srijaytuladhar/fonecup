import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Employee {
  id: string;
  name: string;
  totalPoints: number;
  totalEarnings: number;
}

export interface Match {
  id: string;
  teamA: string;
  teamB: string;
  flagA: string;
  flagB: string;
  matchDate: string;
  actualScoreA: number | null;
  actualScoreB: number | null;
  status: 'scheduled' | 'completed';
  groupName: string;
}

export interface Prediction {
  id: string;
  userId: string;
  matchId: string;
  predictedScoreA: number;
  predictedScoreB: number;
  pointsEarned: number;
}

export interface PoolRules {
  exactScorePoints: number;
  correctOutcomePoints: number;
  amountPerPoint: number;
}

@Injectable({
  providedIn: 'root'
})
export class PredictionService {
  private readonly STORAGE_PREFIX = 'fonepay_wc_';

  private usersSubject = new BehaviorSubject<Employee[]>([]);
  private matchesSubject = new BehaviorSubject<Match[]>([]);
  private predictionsSubject = new BehaviorSubject<Prediction[]>([]);
  private rulesSubject = new BehaviorSubject<PoolRules>({
    exactScorePoints: 3,
    correctOutcomePoints: 1,
    amountPerPoint: 2
  });

  users$ = this.usersSubject.asObservable();
  matches$ = this.matchesSubject.asObservable();
  predictions$ = this.predictionsSubject.asObservable();
  rules$ = this.rulesSubject.asObservable();

  constructor() {
    this.loadInitialData();
  }

  private loadInitialData() {
    const usersData = localStorage.getItem(`${this.STORAGE_PREFIX}users`);
    const matchesData = localStorage.getItem(`${this.STORAGE_PREFIX}matches`);
    const predictionsData = localStorage.getItem(`${this.STORAGE_PREFIX}predictions`);
    const rulesData = localStorage.getItem(`${this.STORAGE_PREFIX}rules`);

    if (rulesData) {
      this.rulesSubject.next(JSON.parse(rulesData));
    }

    if (!usersData || !matchesData) {
      this.seedMockData();
    } else {
      this.usersSubject.next(JSON.parse(usersData));
      this.matchesSubject.next(JSON.parse(matchesData));
      this.predictionsSubject.next(predictionsData ? JSON.parse(predictionsData) : []);
    }
  }

  getFlag(countryName: string): string {
    const flags: { [key: string]: string } = {
      'Mexico': 'mx', 'South Africa': 'za',
      'Korea Republic': 'kr', 'Czechia': 'cz',
      'Canada': 'ca', 'Bosnia and Herzegovina': 'ba',
      'USA': 'us', 'Paraguay': 'py',
      'Qatar': 'qa', 'Switzerland': 'ch',
      'Brazil': 'br', 'Morocco': 'ma',
      'Haiti': 'ht', 'Scotland': 'gb-sct',
      'Australia': 'au', 'Türkiye': 'tr',
      'Germany': 'de', 'Curaçao': 'cw',
      'Côte d\'Ivoire': 'ci', 'Ecuador': 'ec',
      'Netherlands': 'nl', 'Japan': 'jp',
      'Sweden': 'se', 'Tunisia': 'tn',
      'Belgium': 'be', 'Egypt': 'eg',
      'IR Iran': 'ir', 'New Zealand': 'nz',
      'Spain': 'es', 'Cabo Verde': 'cv',
      'Saudi Arabia': 'sa', 'Uruguay': 'uy',
      'France': 'fr', 'Senegal': 'sn',
      'Iraq': 'iq', 'Norway': 'no',
      'Argentina': 'ar', 'Algeria': 'dz',
      'Austria': 'at', 'Jordan': 'jo',
      'Portugal': 'pt', 'Congo DR': 'cd',
      'Uzbekistan': 'uz', 'Colombia': 'co',
      'England': 'gb-eng', 'Croatia': 'hr',
      'Ghana': 'gh', 'Panama': 'pa'
    };
    const code = flags[countryName] || 'un';
    return `https://flagcdn.com/w80/${code}.png`;
  }

  private seedMockData() {
    const mockUsers: Employee[] = [
      { id: 'u1', name: 'Hanok Tamang', totalPoints: 0, totalEarnings: 0 },
      { id: 'u2', name: 'Dipen Limbu', totalPoints: 0, totalEarnings: 0 },
      { id: 'u3', name: 'Ujjwal Shrestha', totalPoints: 0, totalEarnings: 0 },
      { id: 'u4', name: 'Sagun Koirala', totalPoints: 0, totalEarnings: 0 },
      { id: 'u5', name: 'Shree Kishna Thapa Magar', totalPoints: 0, totalEarnings: 0 },
      { id: 'u6', name: 'Srijay Tuladhar', totalPoints: 0, totalEarnings: 0 },
      { id: 'u7', name: 'Pawan Gurung', totalPoints: 0, totalEarnings: 0 },
      { id: 'u8', name: 'Sujesh Sahi', totalPoints: 0, totalEarnings: 0 },
      { id: 'u9', name: 'Subin Sedai', totalPoints: 0, totalEarnings: 0 },
      { id: 'u10', name: 'Shambhav Acharya', totalPoints: 0, totalEarnings: 0 },
      { id: 'u11', name: 'Unish Shrestha', totalPoints: 0, totalEarnings: 0 },
    ];

    const mockMatches: Match[] = [
      { id: 'm1', teamA: 'Mexico', teamB: 'South Africa', flagA: this.getFlag('Mexico'), flagB: this.getFlag('South Africa'), matchDate: '2026-06-11T15:00:00Z', actualScoreA: null, actualScoreB: null, status: 'scheduled', groupName: 'Group A' },
      { id: 'm2', teamA: 'Korea Republic', teamB: 'Czechia', flagA: this.getFlag('Korea Republic'), flagB: this.getFlag('Czechia'), matchDate: '2026-06-11T18:00:00Z', actualScoreA: null, actualScoreB: null, status: 'scheduled', groupName: 'Group A' },
      { id: 'm3', teamA: 'Canada', teamB: 'Bosnia and Herzegovina', flagA: this.getFlag('Canada'), flagB: this.getFlag('Bosnia and Herzegovina'), matchDate: '2026-06-12T15:00:00Z', actualScoreA: null, actualScoreB: null, status: 'scheduled', groupName: 'Group B' },
      { id: 'm4', teamA: 'USA', teamB: 'Paraguay', flagA: this.getFlag('USA'), flagB: this.getFlag('Paraguay'), matchDate: '2026-06-12T18:00:00Z', actualScoreA: null, actualScoreB: null, status: 'scheduled', groupName: 'Group D' },
      { id: 'm5', teamA: 'Qatar', teamB: 'Switzerland', flagA: this.getFlag('Qatar'), flagB: this.getFlag('Switzerland'), matchDate: '2026-06-13T15:00:00Z', actualScoreA: null, actualScoreB: null, status: 'scheduled', groupName: 'Group B' },
      { id: 'm6', teamA: 'Brazil', teamB: 'Morocco', flagA: this.getFlag('Brazil'), flagB: this.getFlag('Morocco'), matchDate: '2026-06-13T18:00:00Z', actualScoreA: null, actualScoreB: null, status: 'scheduled', groupName: 'Group C' },
      { id: 'm7', teamA: 'Haiti', teamB: 'Scotland', flagA: this.getFlag('Haiti'), flagB: this.getFlag('Scotland'), matchDate: '2026-06-13T21:00:00Z', actualScoreA: null, actualScoreB: null, status: 'scheduled', groupName: 'Group C' },
      { id: 'm8', teamA: 'Australia', teamB: 'Türkiye', flagA: this.getFlag('Australia'), flagB: this.getFlag('Türkiye'), matchDate: '2026-06-13T23:00:00Z', actualScoreA: null, actualScoreB: null, status: 'scheduled', groupName: 'Group D' },
      { id: 'm9', teamA: 'Germany', teamB: 'Curaçao', flagA: this.getFlag('Germany'), flagB: this.getFlag('Curaçao'), matchDate: '2026-06-14T15:00:00Z', actualScoreA: null, actualScoreB: null, status: 'scheduled', groupName: 'Group E' },
      { id: 'm10', teamA: 'Côte d\'Ivoire', teamB: 'Ecuador', flagA: this.getFlag('Côte d\'Ivoire'), flagB: this.getFlag('Ecuador'), matchDate: '2026-06-14T18:00:00Z', actualScoreA: null, actualScoreB: null, status: 'scheduled', groupName: 'Group E' },
      { id: 'm11', teamA: 'Netherlands', teamB: 'Japan', flagA: this.getFlag('Netherlands'), flagB: this.getFlag('Japan'), matchDate: '2026-06-14T21:00:00Z', actualScoreA: null, actualScoreB: null, status: 'scheduled', groupName: 'Group F' },
      { id: 'm12', teamA: 'Sweden', teamB: 'Tunisia', flagA: this.getFlag('Sweden'), flagB: this.getFlag('Tunisia'), matchDate: '2026-06-14T23:00:00Z', actualScoreA: null, actualScoreB: null, status: 'scheduled', groupName: 'Group F' },
      { id: 'm13', teamA: 'Belgium', teamB: 'Egypt', flagA: this.getFlag('Belgium'), flagB: this.getFlag('Egypt'), matchDate: '2026-06-15T15:00:00Z', actualScoreA: null, actualScoreB: null, status: 'scheduled', groupName: 'Group G' },
      { id: 'm14', teamA: 'IR Iran', teamB: 'New Zealand', flagA: this.getFlag('IR Iran'), flagB: this.getFlag('New Zealand'), matchDate: '2026-06-15T18:00:00Z', actualScoreA: null, actualScoreB: null, status: 'scheduled', groupName: 'Group G' },
      { id: 'm15', teamA: 'Spain', teamB: 'Cabo Verde', flagA: this.getFlag('Spain'), flagB: this.getFlag('Cabo Verde'), matchDate: '2026-06-15T21:00:00Z', actualScoreA: null, actualScoreB: null, status: 'scheduled', groupName: 'Group H' },
      { id: 'm16', teamA: 'Saudi Arabia', teamB: 'Uruguay', flagA: this.getFlag('Saudi Arabia'), flagB: this.getFlag('Uruguay'), matchDate: '2026-06-15T23:00:00Z', actualScoreA: null, actualScoreB: null, status: 'scheduled', groupName: 'Group H' },
      { id: 'm17', teamA: 'France', teamB: 'Senegal', flagA: this.getFlag('France'), flagB: this.getFlag('Senegal'), matchDate: '2026-06-16T15:00:00Z', actualScoreA: null, actualScoreB: null, status: 'scheduled', groupName: 'Group I' },
      { id: 'm18', teamA: 'Iraq', teamB: 'Norway', flagA: this.getFlag('Iraq'), flagB: this.getFlag('Norway'), matchDate: '2026-06-16T18:00:00Z', actualScoreA: null, actualScoreB: null, status: 'scheduled', groupName: 'Group I' },
      { id: 'm19', teamA: 'Argentina', teamB: 'Algeria', flagA: this.getFlag('Argentina'), flagB: this.getFlag('Algeria'), matchDate: '2026-06-16T21:00:00Z', actualScoreA: null, actualScoreB: null, status: 'scheduled', groupName: 'Group J' },
      { id: 'm20', teamA: 'Austria', teamB: 'Jordan', flagA: this.getFlag('Austria'), flagB: this.getFlag('Jordan'), matchDate: '2026-06-16T23:00:00Z', actualScoreA: null, actualScoreB: null, status: 'scheduled', groupName: 'Group J' },
      { id: 'm21', teamA: 'Portugal', teamB: 'Congo DR', flagA: this.getFlag('Portugal'), flagB: this.getFlag('Congo DR'), matchDate: '2026-06-17T15:00:00Z', actualScoreA: null, actualScoreB: null, status: 'scheduled', groupName: 'Group K' },
      { id: 'm22', teamA: 'Uzbekistan', teamB: 'Colombia', flagA: this.getFlag('Uzbekistan'), flagB: this.getFlag('Colombia'), matchDate: '2026-06-17T18:00:00Z', actualScoreA: null, actualScoreB: null, status: 'scheduled', groupName: 'Group K' },
      { id: 'm23', teamA: 'England', teamB: 'Croatia', flagA: this.getFlag('England'), flagB: this.getFlag('Croatia'), matchDate: '2026-06-17T21:00:00Z', actualScoreA: null, actualScoreB: null, status: 'scheduled', groupName: 'Group L' },
      { id: 'm24', teamA: 'Ghana', teamB: 'Panama', flagA: this.getFlag('Ghana'), flagB: this.getFlag('Panama'), matchDate: '2026-06-17T23:00:00Z', actualScoreA: null, actualScoreB: null, status: 'scheduled', groupName: 'Group L' }
    ];

    this.saveData('users', mockUsers);
    this.saveData('matches', mockMatches);
    this.saveData('predictions', []);

    this.usersSubject.next(mockUsers);
    this.matchesSubject.next(mockMatches);
    this.predictionsSubject.next([]);
  }

  private saveData(key: string, data: any) {
    localStorage.setItem(`${this.STORAGE_PREFIX}${key}`, JSON.stringify(data));
  }

  // --- Users ---
  getUsers(): Employee[] {
    return this.usersSubject.getValue();
  }

  addUser(name: string) {
    const users = this.getUsers();
    const newUser: Employee = {
      id: 'u' + Date.now(),
      name,
      totalPoints: 0,
      totalEarnings: 0
    };
    users.push(newUser);
    this.saveData('users', users);
    this.usersSubject.next(users);
  }

  // --- Matches ---
  getMatches(): Match[] {
    return this.matchesSubject.getValue();
  }

  addMatch(teamA: string, teamB: string, matchDate: string, groupName: string) {
    const matches = this.getMatches();
    const newMatch: Match = {
      id: 'm' + Date.now(),
      teamA,
      teamB,
      flagA: this.getFlag(teamA),
      flagB: this.getFlag(teamB),
      matchDate,
      actualScoreA: null,
      actualScoreB: null,
      status: 'scheduled',
      groupName
    };
    const updated = [...matches, newMatch];
    this.saveData('matches', updated);
    this.matchesSubject.next(updated);
  }

  // --- Predictions ---
  getPredictions(): Prediction[] {
    return this.predictionsSubject.getValue();
  }

  savePrediction(userId: string, matchId: string, scoreA: number, scoreB: number) {
    const predictions = this.getPredictions();
    const existingIndex = predictions.findIndex(p => p.userId === userId && p.matchId === matchId);

    const newPrediction: Prediction = {
      id: existingIndex > -1 ? predictions[existingIndex].id : 'p' + Date.now(),
      userId,
      matchId,
      predictedScoreA: scoreA,
      predictedScoreB: scoreB,
      pointsEarned: 0
    };

    if (existingIndex > -1) {
      predictions[existingIndex] = newPrediction;
    } else {
      predictions.push(newPrediction);
    }

    this.saveData('predictions', predictions);
    this.predictionsSubject.next(predictions);
  }

  // --- Rules ---
  updateRules(rules: PoolRules) {
    this.saveData('rules', rules);
    this.rulesSubject.next(rules);
    this.recalculateAllPoints();
  }

  getRules(): PoolRules {
    return this.rulesSubject.getValue();
  }

  // --- Core Calculation Logic ---
  resolveMatch(matchId: string, actualScoreA: number, actualScoreB: number) {
    const matches = this.getMatches();
    const matchIndex = matches.findIndex(m => m.id === matchId);

    if (matchIndex > -1) {
      matches[matchIndex].actualScoreA = actualScoreA;
      matches[matchIndex].actualScoreB = actualScoreB;
      matches[matchIndex].status = 'completed';
      this.saveData('matches', matches);
      this.matchesSubject.next(matches);

      this.recalculateAllPoints();
    }
  }

  getRemainingPool(): number {
    const E = this.getUsers().length;
    const completedMatchesCount = this.getMatches().filter(m => m.status === 'completed').length;
    const initialPool = 30 * 104 * E;
    const remaining = initialPool - (completedMatchesCount * 30 * E);
    return Math.max(0, remaining);
  }

  private calculatePointsForMatch(matchId: string) {
    // This is handled by recalculateAllPoints to ensure correct distribution order,
    // but we define it here as a helper for individual matches if needed.
    const match = this.getMatches().find(m => m.id === matchId);
    if (!match || match.status !== 'completed') return;

    const predictions = this.getPredictions();
    const matchPredictions = predictions.filter(p => p.matchId === matchId);

    const totalEmployees = this.getUsers().length;
    const matchPrize = 30 * totalEmployees;
    const outcomePool = matchPrize / 2;
    const exactPool = matchPrize / 2;

    const actualDiff = match.actualScoreA! - match.actualScoreB!;
    
    // Outcome predictions: correct win or correct draw
    const successfulOutcomePreds = matchPredictions.filter(pred => {
      const predDiff = pred.predictedScoreA - pred.predictedScoreB;
      return (actualDiff > 0 && predDiff > 0) || 
             (actualDiff < 0 && predDiff < 0) || 
             (actualDiff === 0 && predDiff === 0);
    });

    // Exact score predictions
    const successfulExactPreds = matchPredictions.filter(pred => {
      return pred.predictedScoreA === match.actualScoreA && 
             pred.predictedScoreB === match.actualScoreB;
    });

    const N_outcome = successfulOutcomePreds.length;
    const N_exact = successfulExactPreds.length;

    const outcomeShare = N_outcome > 0 ? outcomePool / N_outcome : 0;
    const exactShare = N_exact > 0 ? exactPool / N_exact : 0;

    matchPredictions.forEach(pred => {
      pred.pointsEarned = 0;
    });

    successfulOutcomePreds.forEach(pred => {
      pred.pointsEarned += outcomeShare;
    });

    successfulExactPreds.forEach(pred => {
      pred.pointsEarned += exactShare;
    });

    matchPredictions.forEach(pred => {
      pred.pointsEarned = Number(pred.pointsEarned.toFixed(2));
    });

    this.saveData('predictions', predictions);
    this.predictionsSubject.next(predictions);
  }

  private recalculateAllPoints() {
    const matches = this.getMatches().filter(m => m.status === 'completed');
    
    // Recalculate share for each completed match
    matches.forEach(m => {
      this.calculatePointsForMatch(m.id);
    });

    // Aggregate back to users
    this.aggregateUserScores();
  }

  private aggregateUserScores() {
    const users = this.getUsers();
    const predictions = this.getPredictions();

    users.forEach(user => {
      const userPreds = predictions.filter(p => p.userId === user.id);
      const totalEarnings = userPreds.reduce((sum, p) => sum + p.pointsEarned, 0);
      user.totalPoints = Number(totalEarnings.toFixed(2));
      user.totalEarnings = Number(totalEarnings.toFixed(2));
    });

    this.saveData('users', users);
    this.usersSubject.next(users);
  }

  resetData() {
    localStorage.removeItem(`${this.STORAGE_PREFIX}users`);
    localStorage.removeItem(`${this.STORAGE_PREFIX}matches`);
    localStorage.removeItem(`${this.STORAGE_PREFIX}predictions`);
    this.seedMockData();
  }
}
