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
  const mockMatches = [
    { id: 'm1', teamA: 'Mexico', teamB: 'South Africa', flagA: getFlag('Mexico'), flagB: getFlag('South Africa'), matchDate: '2026-06-11T15:00:00Z', actualScoreA: null, actualScoreB: null, status: 'scheduled', groupName: 'Group A' },
    { id: 'm2', teamA: 'Korea Republic', teamB: 'Czechia', flagA: getFlag('Korea Republic'), flagB: getFlag('Czechia'), matchDate: '2026-06-11T18:00:00Z', actualScoreA: null, actualScoreB: null, status: 'scheduled', groupName: 'Group A' },
    { id: 'm3', teamA: 'Canada', teamB: 'Bosnia and Herzegovina', flagA: getFlag('Canada'), flagB: getFlag('Bosnia and Herzegovina'), matchDate: '2026-06-12T15:00:00Z', actualScoreA: null, actualScoreB: null, status: 'scheduled', groupName: 'Group B' },
    { id: 'm4', teamA: 'USA', teamB: 'Paraguay', flagA: getFlag('USA'), flagB: getFlag('Paraguay'), matchDate: '2026-06-12T18:00:00Z', actualScoreA: null, actualScoreB: null, status: 'scheduled', groupName: 'Group D' },
    { id: 'm5', teamA: 'Qatar', teamB: 'Switzerland', flagA: getFlag('Qatar'), flagB: getFlag('Switzerland'), matchDate: '2026-06-13T15:00:00Z', actualScoreA: null, actualScoreB: null, status: 'scheduled', groupName: 'Group B' },
    { id: 'm6', teamA: 'Brazil', teamB: 'Morocco', flagA: getFlag('Brazil'), flagB: getFlag('Morocco'), matchDate: '2026-06-13T18:00:00Z', actualScoreA: null, actualScoreB: null, status: 'scheduled', groupName: 'Group C' },
    { id: 'm7', teamA: 'Haiti', teamB: 'Scotland', flagA: getFlag('Haiti'), flagB: getFlag('Scotland'), matchDate: '2026-06-13T21:00:00Z', actualScoreA: null, actualScoreB: null, status: 'scheduled', groupName: 'Group C' },
    { id: 'm8', teamA: 'Australia', teamB: 'Türkiye', flagA: getFlag('Australia'), flagB: getFlag('Türkiye'), matchDate: '2026-06-13T23:00:00Z', actualScoreA: null, actualScoreB: null, status: 'scheduled', groupName: 'Group D' },
    { id: 'm9', teamA: 'Germany', teamB: 'Curaçao', flagA: getFlag('Germany'), flagB: getFlag('Curaçao'), matchDate: '2026-06-14T15:00:00Z', actualScoreA: null, actualScoreB: null, status: 'scheduled', groupName: 'Group E' },
    { id: 'm10', teamA: 'Côte d\'Ivoire', teamB: 'Ecuador', flagA: getFlag('Côte d\'Ivoire'), flagB: getFlag('Ecuador'), matchDate: '2026-06-14T18:00:00Z', actualScoreA: null, actualScoreB: null, status: 'scheduled', groupName: 'Group E' },
    { id: 'm11', teamA: 'Netherlands', teamB: 'Japan', flagA: getFlag('Netherlands'), flagB: getFlag('Japan'), matchDate: '2026-06-14T21:00:00Z', actualScoreA: null, actualScoreB: null, status: 'scheduled', groupName: 'Group F' },
    { id: 'm12', teamA: 'Sweden', teamB: 'Tunisia', flagA: getFlag('Sweden'), flagB: getFlag('Tunisia'), matchDate: '2026-06-14T23:00:00Z', actualScoreA: null, actualScoreB: null, status: 'scheduled', groupName: 'Group F' },
    { id: 'm13', teamA: 'Belgium', teamB: 'Egypt', flagA: getFlag('Belgium'), flagB: getFlag('Egypt'), matchDate: '2026-06-15T15:00:00Z', actualScoreA: null, actualScoreB: null, status: 'scheduled', groupName: 'Group G' },
    { id: 'm14', teamA: 'IR Iran', teamB: 'New Zealand', flagA: getFlag('IR Iran'), flagB: getFlag('New Zealand'), matchDate: '2026-06-15T18:00:00Z', actualScoreA: null, actualScoreB: null, status: 'scheduled', groupName: 'Group G' },
    { id: 'm15', teamA: 'Spain', teamB: 'Cabo Verde', flagA: getFlag('Spain'), flagB: getFlag('Cabo Verde'), matchDate: '2026-06-15T21:00:00Z', actualScoreA: null, actualScoreB: null, status: 'scheduled', groupName: 'Group H' },
    { id: 'm16', teamA: 'Saudi Arabia', teamB: 'Uruguay', flagA: getFlag('Saudi Arabia'), flagB: getFlag('Uruguay'), matchDate: '2026-06-15T23:00:00Z', actualScoreA: null, actualScoreB: null, status: 'scheduled', groupName: 'Group H' },
    { id: 'm17', teamA: 'France', teamB: 'Senegal', flagA: getFlag('France'), flagB: getFlag('Senegal'), matchDate: '2026-06-16T15:00:00Z', actualScoreA: null, actualScoreB: null, status: 'scheduled', groupName: 'Group I' },
    { id: 'm18', teamA: 'Iraq', teamB: 'Norway', flagA: getFlag('Iraq'), flagB: getFlag('Norway'), matchDate: '2026-06-16T18:00:00Z', actualScoreA: null, actualScoreB: null, status: 'scheduled', groupName: 'Group I' },
    { id: 'm19', teamA: 'Argentina', teamB: 'Algeria', flagA: getFlag('Argentina'), flagB: getFlag('Algeria'), matchDate: '2026-06-16T21:00:00Z', actualScoreA: null, actualScoreB: null, status: 'scheduled', groupName: 'Group J' },
    { id: 'm20', teamA: 'Austria', teamB: 'Jordan', flagA: getFlag('Austria'), flagB: getFlag('Jordan'), matchDate: '2026-06-16T23:00:00Z', actualScoreA: null, actualScoreB: null, status: 'scheduled', groupName: 'Group J' },
    { id: 'm21', teamA: 'Portugal', teamB: 'Congo DR', flagA: getFlag('Portugal'), flagB: getFlag('Congo DR'), matchDate: '2026-06-17T15:00:00Z', actualScoreA: null, actualScoreB: null, status: 'scheduled', groupName: 'Group K' },
    { id: 'm22', teamA: 'Uzbekistan', teamB: 'Colombia', flagA: getFlag('Uzbekistan'), flagB: getFlag('Colombia'), matchDate: '2026-06-17T18:00:00Z', actualScoreA: null, actualScoreB: null, status: 'scheduled', groupName: 'Group K' },
    { id: 'm23', teamA: 'England', teamB: 'Croatia', flagA: getFlag('England'), flagB: getFlag('Croatia'), matchDate: '2026-06-17T21:00:00Z', actualScoreA: null, actualScoreB: null, status: 'scheduled', groupName: 'Group L' },
    { id: 'm24', teamA: 'Ghana', teamB: 'Panama', flagA: getFlag('Ghana'), flagB: getFlag('Panama'), matchDate: '2026-06-17T23:00:00Z', actualScoreA: null, actualScoreB: null, status: 'scheduled', groupName: 'Group L' }
  ];
  const matchBatch = writeBatch(db);
  mockMatches.forEach(match => {
    matchBatch.set(doc(db, 'matches', match.id), match);
  });
  await matchBatch.commit();
  console.log("Matches Seeded Successfully!");
  
  process.exit(0);
}

seed().catch(err => {
  console.error("Error seeding Firestore:", err);
  process.exit(1);
});
