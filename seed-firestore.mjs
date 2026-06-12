import { initializeApp } from "firebase/app";
import { getFirestore, doc, writeBatch } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCsLKcCq99QOxEjw9LoOQuuzS8QsGGOM_A",
  authDomain: "fonecup-948e1.firebaseapp.com",
  projectId: "fonecup-948e1",
  storageBucket: "fonecup-948e1.firebasestorage.app",
  messagingSenderId: "777075559104",
  appId: "1:777075559104:web:a2ac4d5b1c46a74a17bb25",
  measurementId: "G-XBWV72WNEM"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function getFlag(countryName) {
  const flags = {
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

async function seed() {
  console.log("Seeding Users...");
  const mockUsers = [
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
    { id: 'u11', name: 'Unish Shrestha', totalPoints: 0, totalEarnings: 0 }
  ];
  const userBatch = writeBatch(db);
  mockUsers.forEach(user => {
    userBatch.set(doc(db, 'users', user.id), user);
  });
  await userBatch.commit();
  console.log("Users Seeded Successfully!");
  console.log("Seeding Matches...");
  const originalMatches = [
    { id: 'm1', teamA: 'Mexico', teamB: 'South Africa', matchDate: '2026-06-12T00:45:00+05:45', groupName: 'Group A' },
    { id: 'm2', teamA: 'Korea Republic', teamB: 'Czechia', matchDate: '2026-06-12T02:45:00+05:45', groupName: 'Group A' },
    { id: 'm3', teamA: 'Canada', teamB: 'Bosnia and Herzegovina', matchDate: '2026-06-12T18:45:00+05:45', groupName: 'Group B' },
    { id: 'm4', teamA: 'USA', teamB: 'Paraguay', matchDate: '2026-06-12T21:45:00+05:45', groupName: 'Group D' },
    { id: 'm5', teamA: 'Qatar', teamB: 'Switzerland', matchDate: '2026-06-13T18:45:00+05:45', groupName: 'Group B' },
    { id: 'm6', teamA: 'Brazil', teamB: 'Morocco', matchDate: '2026-06-13T21:45:00+05:45', groupName: 'Group C' },
    { id: 'm7', teamA: 'Haiti', teamB: 'Scotland', matchDate: '2026-06-14T00:45:00+05:45', groupName: 'Group C' },
    { id: 'm8', teamA: 'Australia', teamB: 'Türkiye', matchDate: '2026-06-14T02:45:00+05:45', groupName: 'Group D' },
    { id: 'm9', teamA: 'Germany', teamB: 'Curaçao', matchDate: '2026-06-14T18:45:00+05:45', groupName: 'Group E' },
    { id: 'm10', teamA: 'Côte d\'Ivoire', teamB: 'Ecuador', matchDate: '2026-06-14T21:45:00+05:45', groupName: 'Group E' },
    { id: 'm11', teamA: 'Netherlands', teamB: 'Japan', matchDate: '2026-06-15T00:45:00+05:45', groupName: 'Group F' },
    { id: 'm12', teamA: 'Sweden', teamB: 'Tunisia', matchDate: '2026-06-15T02:45:00+05:45', groupName: 'Group F' },
    { id: 'm13', teamA: 'Belgium', teamB: 'Egypt', matchDate: '2026-06-15T18:45:00+05:45', groupName: 'Group G' },
    { id: 'm14', teamA: 'IR Iran', teamB: 'New Zealand', matchDate: '2026-06-15T21:45:00+05:45', groupName: 'Group G' },
    { id: 'm15', teamA: 'Spain', teamB: 'Cabo Verde', matchDate: '2026-06-16T00:45:00+05:45', groupName: 'Group H' },
    { id: 'm16', teamA: 'Saudi Arabia', teamB: 'Uruguay', matchDate: '2026-06-16T02:45:00+05:45', groupName: 'Group H' },
    { id: 'm17', teamA: 'France', teamB: 'Senegal', matchDate: '2026-06-16T18:45:00+05:45', groupName: 'Group I' },
    { id: 'm18', teamA: 'Iraq', teamB: 'Norway', matchDate: '2026-06-16T21:45:00+05:45', groupName: 'Group I' },
    { id: 'm19', teamA: 'Argentina', teamB: 'Algeria', matchDate: '2026-06-17T00:45:00+05:45', groupName: 'Group J' },
    { id: 'm20', teamA: 'Austria', teamB: 'Jordan', matchDate: '2026-06-17T02:45:00+05:45', groupName: 'Group J' },
    { id: 'm21', teamA: 'Portugal', teamB: 'Congo DR', matchDate: '2026-06-17T18:45:00+05:45', groupName: 'Group K' },
    { id: 'm22', teamA: 'Uzbekistan', teamB: 'Colombia', matchDate: '2026-06-17T21:45:00+05:45', groupName: 'Group K' },
    { id: 'm23', teamA: 'England', teamB: 'Croatia', matchDate: '2026-06-18T00:45:00+05:45', groupName: 'Group L' },
    { id: 'm24', teamA: 'Ghana', teamB: 'Panama', matchDate: '2026-06-18T02:45:00+05:45', groupName: 'Group L' }
  ];

  const mockMatches = originalMatches.map(m => ({
    ...m,
    flagA: getFlag(m.teamA),
    flagB: getFlag(m.teamB),
    actualScoreA: null,
    actualScoreB: null,
    status: 'scheduled'
  }));

  const groups = {
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

  const timeSlots = ['18:45:00+05:45', '21:45:00+05:45', '00:45:00+05:45', '02:45:00+05:45'];
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
      let day = r2StartDay + Math.floor(r2MatchIndex / 4);
      const slot = timeSlots[r2MatchIndex % 4];
      if (slot.startsWith('00:') || slot.startsWith('02:')) {
        day += 1;
      }
      const matchDate = `2026-06-${day.toString().padStart(2, '0')}T${slot}`;

      mockMatches.push({
        id: `m${currentMatchId++}`,
        teamA: p.a,
        teamB: p.b,
        flagA: getFlag(p.a),
        flagB: getFlag(p.b),
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
      let day = r3StartDay + Math.floor(r3MatchIndex / 4);
      const slot = timeSlots[r3MatchIndex % 4];
      if (slot.startsWith('00:') || slot.startsWith('02:')) {
        day += 1;
      }
      const matchDate = `2026-06-${day.toString().padStart(2, '0')}T${slot}`;

      mockMatches.push({
        id: `m${currentMatchId++}`,
        teamA: p.a,
        teamB: p.b,
        flagA: getFlag(p.a),
        flagB: getFlag(p.b),
        matchDate,
        actualScoreA: null,
        actualScoreB: null,
        status: 'scheduled',
        groupName
      });
      r3MatchIndex++;
    });
  });

  // Firestore writeBatch has a limit of 500 writes, so 72 matches + 11 users = 83 is well under the limit.
  const matchBatch = writeBatch(db);
  mockMatches.forEach(match => {
    matchBatch.set(doc(db, 'matches', match.id), match);
  });
  await matchBatch.commit();
  console.log(`Matches Seeded Successfully! Total matches seeded: ${mockMatches.length}`);
  
  process.exit(0);
}

seed().catch(err => {
  console.error("Error seeding Firestore:", err);
  process.exit(1);
});
