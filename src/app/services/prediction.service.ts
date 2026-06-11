import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  onSnapshot, 
  writeBatch 
} from 'firebase/firestore';
import { firebaseConfig } from '../../environments/firebase-config';

export interface Employee {
  id: string;
  name: string;
  totalPoints: number;
  totalEarnings: number;
  championPrediction?: string;
  isPaid?: boolean;
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
  private app = initializeApp(firebaseConfig);
  private db = getFirestore(this.app);

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
    onSnapshot(collection(this.db, 'users'), (snapshot) => {
      const users: Employee[] = [];
      snapshot.forEach((docSnap) => {
        users.push(docSnap.data() as Employee);
      });
      if (users.length === 0) {
        this.seedMockUsers();
      } else {
        this.usersSubject.next(users);
      }
    });

    onSnapshot(collection(this.db, 'matches'), (snapshot) => {
      const matches: Match[] = [];
      snapshot.forEach((docSnap) => {
        matches.push(docSnap.data() as Match);
      });
      if (matches.length === 0) {
        this.seedMockMatches();
      } else {
        matches.sort((a, b) => new Date(a.matchDate).getTime() - new Date(b.matchDate).getTime());
        this.matchesSubject.next(matches);
      }
    });

    onSnapshot(collection(this.db, 'predictions'), (snapshot) => {
      const predictions: Prediction[] = [];
      snapshot.forEach((docSnap) => {
        predictions.push(docSnap.data() as Prediction);
      });
      this.predictionsSubject.next(predictions);
    });
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

  private async seedMockUsers() {
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
    const batch = writeBatch(this.db);
    mockUsers.forEach(user => {
      batch.set(doc(this.db, 'users', user.id), user);
    });
    await batch.commit();
  }

  private async seedMockMatches() {
    const originalMatches = [
      { id: 'm1', teamA: 'Mexico', teamB: 'South Africa', matchDate: '2026-06-11T15:00:00Z', groupName: 'Group A' },
      { id: 'm2', teamA: 'Korea Republic', teamB: 'Czechia', matchDate: '2026-06-11T18:00:00Z', groupName: 'Group A' },
      { id: 'm3', teamA: 'Canada', teamB: 'Bosnia and Herzegovina', matchDate: '2026-06-12T15:00:00Z', groupName: 'Group B' },
      { id: 'm4', teamA: 'USA', teamB: 'Paraguay', matchDate: '2026-06-12T18:00:00Z', groupName: 'Group D' },
      { id: 'm5', teamA: 'Qatar', teamB: 'Switzerland', matchDate: '2026-06-13T15:00:00Z', groupName: 'Group B' },
      { id: 'm6', teamA: 'Brazil', teamB: 'Morocco', matchDate: '2026-06-13T18:00:00Z', groupName: 'Group C' },
      { id: 'm7', teamA: 'Haiti', teamB: 'Scotland', matchDate: '2026-06-13T21:00:00Z', groupName: 'Group C' },
      { id: 'm8', teamA: 'Australia', teamB: 'Türkiye', matchDate: '2026-06-13T23:00:00Z', groupName: 'Group D' },
      { id: 'm9', teamA: 'Germany', teamB: 'Curaçao', matchDate: '2026-06-14T15:00:00Z', groupName: 'Group E' },
      { id: 'm10', teamA: 'Côte d\'Ivoire', teamB: 'Ecuador', matchDate: '2026-06-14T18:00:00Z', groupName: 'Group E' },
      { id: 'm11', teamA: 'Netherlands', teamB: 'Japan', matchDate: '2026-06-14T21:00:00Z', groupName: 'Group F' },
      { id: 'm12', teamA: 'Sweden', teamB: 'Tunisia', matchDate: '2026-06-14T23:00:00Z', groupName: 'Group F' },
      { id: 'm13', teamA: 'Belgium', teamB: 'Egypt', matchDate: '2026-06-15T15:00:00Z', groupName: 'Group G' },
      { id: 'm14', teamA: 'IR Iran', teamB: 'New Zealand', matchDate: '2026-06-15T18:00:00Z', groupName: 'Group G' },
      { id: 'm15', teamA: 'Spain', teamB: 'Cabo Verde', matchDate: '2026-06-15T21:00:00Z', groupName: 'Group H' },
      { id: 'm16', teamA: 'Saudi Arabia', teamB: 'Uruguay', matchDate: '2026-06-15T23:00:00Z', groupName: 'Group H' },
      { id: 'm17', teamA: 'France', teamB: 'Senegal', matchDate: '2026-06-16T15:00:00Z', groupName: 'Group I' },
      { id: 'm18', teamA: 'Iraq', teamB: 'Norway', matchDate: '2026-06-16T18:00:00Z', groupName: 'Group I' },
      { id: 'm19', teamA: 'Argentina', teamB: 'Algeria', matchDate: '2026-06-16T21:00:00Z', groupName: 'Group J' },
      { id: 'm20', teamA: 'Austria', teamB: 'Jordan', matchDate: '2026-06-16T23:00:00Z', groupName: 'Group J' },
      { id: 'm21', teamA: 'Portugal', teamB: 'Congo DR', matchDate: '2026-06-17T15:00:00Z', groupName: 'Group K' },
      { id: 'm22', teamA: 'Uzbekistan', teamB: 'Colombia', matchDate: '2026-06-17T18:00:00Z', groupName: 'Group K' },
      { id: 'm23', teamA: 'England', teamB: 'Croatia', matchDate: '2026-06-17T21:00:00Z', groupName: 'Group L' },
      { id: 'm24', teamA: 'Ghana', teamB: 'Panama', matchDate: '2026-06-17T23:00:00Z', groupName: 'Group L' }
    ];

    const mockMatches: Match[] = originalMatches.map(m => ({
      ...m,
      flagA: this.getFlag(m.teamA),
      flagB: this.getFlag(m.teamB),
      actualScoreA: null,
      actualScoreB: null,
      status: 'scheduled'
    }));

    const groups: { [key: string]: string[] } = {
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

    const timeSlots = ['15:00:00Z', '18:00:00Z', '21:00:00Z', '23:00:00Z'];
    let currentMatchId = 25;

    // Round 2
    let r2StartDay = 18;
    let r2MatchIndex = 0;
    Object.entries(groups).forEach(([groupName, teams]) => {
      const pairings = [
        { a: teams[0], b: teams[2] },
        { a: teams[1], b: teams[3] }
      ];
      pairings.forEach(p => {
        const day = r2StartDay + Math.floor(r2MatchIndex / 4);
        const slot = timeSlots[r2MatchIndex % 4];
        const matchDate = `2026-06-${day.toString().padStart(2, '0')}T${slot}`;

        mockMatches.push({
          id: `m${currentMatchId++}`,
          teamA: p.a,
          teamB: p.b,
          flagA: this.getFlag(p.a),
          flagB: this.getFlag(p.b),
          matchDate,
          actualScoreA: null,
          actualScoreB: null,
          status: 'scheduled',
          groupName
        });
        r2MatchIndex++;
      });
    });

    // Round 3
    let r3StartDay = 24;
    let r3MatchIndex = 0;
    Object.entries(groups).forEach(([groupName, teams]) => {
      const pairings = [
        { a: teams[0], b: teams[3] },
        { a: teams[1], b: teams[2] }
      ];
      pairings.forEach(p => {
        const day = r3StartDay + Math.floor(r3MatchIndex / 4);
        const slot = timeSlots[r3MatchIndex % 4];
        const matchDate = `2026-06-${day.toString().padStart(2, '0')}T${slot}`;

        mockMatches.push({
          id: `m${currentMatchId++}`,
          teamA: p.a,
          teamB: p.b,
          flagA: this.getFlag(p.a),
          flagB: this.getFlag(p.b),
          matchDate,
          actualScoreA: null,
          actualScoreB: null,
          status: 'scheduled',
          groupName
        });
        r3MatchIndex++;
      });
    });

    const batch = writeBatch(this.db);
    mockMatches.forEach(match => {
      batch.set(doc(this.db, 'matches', match.id), match);
    });
    await batch.commit();
  }

  getUsers(): Employee[] {
    return this.usersSubject.getValue();
  }

  async addUser(name: string) {
    const id = 'u' + Date.now();
    const newUser: Employee = {
      id,
      name,
      totalPoints: 0,
      totalEarnings: 0,
      isPaid: false
    };
    await setDoc(doc(this.db, 'users', id), newUser);
  }

  getMatches(): Match[] {
    return this.matchesSubject.getValue();
  }

  async addMatch(teamA: string, teamB: string, matchDate: string, groupName: string) {
    const id = 'm' + Date.now();
    const newMatch: Match = {
      id,
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
    await setDoc(doc(this.db, 'matches', id), newMatch);
  }

  getPredictions(): Prediction[] {
    return this.predictionsSubject.getValue();
  }

  async savePrediction(userId: string, matchId: string, scoreA: number, scoreB: number) {
    const predictions = this.getPredictions();
    const existing = predictions.find(p => p.userId === userId && p.matchId === matchId);
    const id = existing ? existing.id : 'p' + Date.now();

    const newPrediction: Prediction = {
      id,
      userId,
      matchId,
      predictedScoreA: scoreA,
      predictedScoreB: scoreB,
      pointsEarned: existing ? existing.pointsEarned : 0
    };
    await setDoc(doc(this.db, 'predictions', id), newPrediction);
  }

  updateRules(rules: PoolRules) {
    this.rulesSubject.next(rules);
    this.recalculateAllPoints();
  }

  getRules(): PoolRules {
    return this.rulesSubject.getValue();
  }

  async resolveMatch(matchId: string, actualScoreA: number, actualScoreB: number) {
    const matchRef = doc(this.db, 'matches', matchId);
    await updateDoc(matchRef, {
      actualScoreA,
      actualScoreB,
      status: 'completed'
    });

    await this.recalculateAllPoints();
  }

  getRemainingPool(): number {
    const E = this.getUsers().length;
    const completedMatchesCount = this.getMatches().filter(m => m.status === 'completed').length;
    const initialPool = 30 * 104 * E;
    const remaining = initialPool - (completedMatchesCount * 30 * E);
    return Math.max(0, remaining);
  }

  private async recalculateAllPoints() {
    const matches = this.getMatches().filter(m => m.status === 'completed');
    const predictions = [...this.getPredictions()];
    const users = [...this.getUsers()];

    predictions.forEach(p => p.pointsEarned = 0);

    for (const match of matches) {
      const matchPredictions = predictions.filter(p => p.matchId === match.id);
      const actualDiff = match.actualScoreA! - match.actualScoreB!;
      
      const successfulOutcomePreds = matchPredictions.filter(pred => {
        const predDiff = pred.predictedScoreA - pred.predictedScoreB;
        return (actualDiff > 0 && predDiff > 0) || 
               (actualDiff < 0 && predDiff < 0) || 
               (actualDiff === 0 && predDiff === 0);
      });

      const successfulExactPreds = matchPredictions.filter(pred => {
        return pred.predictedScoreA === match.actualScoreA && 
               pred.predictedScoreB === match.actualScoreB;
      });

      const N_outcome = successfulOutcomePreds.length;
      const N_exact = successfulExactPreds.length;

      const matchPrize = 30 * users.length;
      const outcomePool = matchPrize / 2;
      const exactPool = matchPrize / 2;

      const outcomeShare = N_outcome > 0 ? outcomePool / N_outcome : 0;
      const exactShare = N_exact > 0 ? exactPool / N_exact : 0;

      matchPredictions.forEach(pred => {
        let earned = 0;
        if (successfulOutcomePreds.some(p => p.id === pred.id)) {
          earned += outcomeShare;
        }
        if (successfulExactPreds.some(p => p.id === pred.id)) {
          earned += exactShare;
        }
        pred.pointsEarned = Number(earned.toFixed(2));
      });
    }

    users.forEach(user => {
      const userPreds = predictions.filter(p => p.userId === user.id);
      const totalEarnings = userPreds.reduce((sum, p) => sum + p.pointsEarned, 0);
      user.totalPoints = Number(totalEarnings.toFixed(2));
      user.totalEarnings = Number(totalEarnings.toFixed(2));
    });

    const batch = writeBatch(this.db);
    
    predictions.forEach(pred => {
      batch.set(doc(this.db, 'predictions', pred.id), pred);
    });
    users.forEach(user => {
      batch.set(doc(this.db, 'users', user.id), user);
    });

    await batch.commit();
  }

  async resetData() {
    const batch = writeBatch(this.db);

    // Delete all predictions
    const predictionsSnap = await getDocs(collection(this.db, 'predictions'));
    predictionsSnap.forEach(d => batch.delete(d.ref));

    // Reset all matches back to 'scheduled' with null scores
    const matchesSnap = await getDocs(collection(this.db, 'matches'));
    matchesSnap.forEach(d => {
      batch.update(d.ref, {
        actualScoreA: null,
        actualScoreB: null,
        status: 'scheduled'
      });
    });

    // Reset all users' points and earnings to 0
    const usersSnap = await getDocs(collection(this.db, 'users'));
    usersSnap.forEach(d => {
      batch.update(d.ref, {
        totalPoints: 0,
        totalEarnings: 0
      });
    });

    await batch.commit();
  }
}
