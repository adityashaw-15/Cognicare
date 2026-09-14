import {
  CaregiverAlert,
  CognitiveGame,
  DailyActivity,
  GameResult,
  Memory,
  MoodEntry,
  Patient,
  Reminder
} from '../types/models';

const now = () => new Date().toISOString();
const today = () => new Date().toISOString().slice(0, 10);
const daysAgo = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().slice(0, 10);
};

export const demoPatient: Patient = {
  id: 'patient-anjali',
  name: 'Anjali Sharma',
  age: 68,
  city: 'Guwahati',
  preferredLanguage: 'en',
  difficultyLevel: 2,
  online: true,
  careNotes: 'Demo patient profile for cognitive support, routine assistance, and caregiver monitoring.',
  updatedAt: now()
};

export const demoGames: CognitiveGame[] = [
  {
    id: 'game-memory-match',
    name: 'Memory Matching',
    type: 'MEMORY_MATCHING',
    description: 'Match familiar objects and exercise short-term recall.',
    suggestedDifficulty: 2
  },
  {
    id: 'game-sequence',
    name: 'Sequence Recall',
    type: 'SEQUENCE_RECALL',
    description: 'Repeat a gentle sequence of colors.',
    suggestedDifficulty: 2
  },
  {
    id: 'game-pattern',
    name: 'Pattern Recognition',
    type: 'PATTERN_RECOGNITION',
    description: 'Choose the item that completes the pattern.',
    suggestedDifficulty: 2
  },
  {
    id: 'game-object',
    name: 'Familiar Object Quiz',
    type: 'OBJECT_RECOGNITION',
    description: 'Answer questions from familiar memories.',
    suggestedDifficulty: 1
  },
  {
    id: 'game-routine',
    name: 'Daily Routine Recall',
    type: 'ROUTINE_RECALL',
    description: "Recall the next step in today's routine.",
    suggestedDifficulty: 2
  },
  {
    id: 'game-attention',
    name: 'Attention Focus',
    type: 'ATTENTION',
    description: 'Tap target cards while ignoring distractions.',
    suggestedDifficulty: 3
  }
];

export const demoMemories: Memory[] = [
  {
    id: 'memory-ananya',
    patientId: demoPatient.id,
    categoryId: 'cat-family',
    categoryName: 'Family',
    personName: 'Ananya',
    relationship: 'Daughter',
    placeName: 'Family home',
    eventName: 'Evening tea together',
    favoriteFood: 'Rice and vegetables',
    favoriteSong: 'Old Hindi classics',
    imageUrl: '/assets/family-photo.svg',
    note: 'Ananya visits on weekends and likes to bring jasmine flowers.',
    promptSeed: 'Who is Ananya, and how is she connected to you?',
    updatedAt: now()
  },
  {
    id: 'memory-darjeeling',
    patientId: demoPatient.id,
    categoryId: 'cat-places',
    categoryName: 'Local Places',
    personName: 'Rahul',
    relationship: 'Son',
    placeName: 'Darjeeling',
    eventName: 'Family trip in 2023',
    favoriteObject: 'Blue shawl',
    imageUrl: '/assets/darjeeling-memory.svg',
    note: 'The family visited Darjeeling together in 2023.',
    promptSeed: 'Where did you visit with Rahul in 2023?',
    updatedAt: now()
  },
  {
    id: 'memory-festival',
    patientId: demoPatient.id,
    categoryId: 'cat-favorites',
    categoryName: 'Favorites',
    personName: 'Family',
    relationship: 'Loved ones',
    placeName: 'Guwahati',
    eventName: 'Bihu celebration',
    favoriteObject: 'Traditional scarf',
    favoriteFood: 'Pitha',
    favoriteSong: 'Folk songs',
    imageUrl: '/assets/festival-memory.svg',
    note: 'The family enjoys Bihu celebrations and familiar songs.',
    promptSeed: 'Which festival is connected with this family memory?',
    updatedAt: now()
  }
];

export const demoReminders: Reminder[] = [
  {
    id: 'reminder-medicine',
    patientId: demoPatient.id,
    title: 'Morning medicine',
    description: 'Take morning medicine after breakfast.',
    date: today(),
    time: '09:00',
    category: 'Medicine',
    priority: 'high',
    completed: false,
    repeatRule: 'daily',
    updatedAt: now()
  },
  {
    id: 'reminder-hydration',
    patientId: demoPatient.id,
    title: 'Hydration',
    description: 'Drink a full glass of water.',
    date: today(),
    time: '10:30',
    category: 'Hydration',
    priority: 'medium',
    completed: false,
    repeatRule: 'daily',
    updatedAt: now()
  },
  {
    id: 'reminder-memory',
    patientId: demoPatient.id,
    title: 'Memory activity',
    description: 'Complete one CogniCare memory activity.',
    date: today(),
    time: '11:00',
    category: 'Cognitive Activity',
    priority: 'medium',
    completed: false,
    repeatRule: 'daily',
    updatedAt: now()
  },
  {
    id: 'reminder-appointment',
    patientId: demoPatient.id,
    title: 'Doctor appointment',
    description: 'Clinic appointment with caregiver support.',
    date: today(),
    time: '16:00',
    category: 'Appointment',
    priority: 'high',
    completed: false,
    repeatRule: 'none',
    updatedAt: now()
  }
];

export const demoActivities: DailyActivity[] = [
  { id: 'activity-medicine', patientId: demoPatient.id, title: 'Morning Medicine', time: '08:00', category: 'Medicine', completed: true, updatedAt: now() },
  { id: 'activity-breakfast', patientId: demoPatient.id, title: 'Breakfast', time: '09:00', category: 'Meals', completed: true, updatedAt: now() },
  { id: 'activity-memory', patientId: demoPatient.id, title: 'Memory Activity', time: '11:00', category: 'Cognitive Activity', completed: false, updatedAt: now() },
  { id: 'activity-lunch', patientId: demoPatient.id, title: 'Lunch', time: '13:00', category: 'Meals', completed: true, updatedAt: now() },
  { id: 'activity-appointment', patientId: demoPatient.id, title: 'Doctor Appointment', time: '16:00', category: 'Appointment', completed: false, updatedAt: now() },
  { id: 'activity-walk', patientId: demoPatient.id, title: 'Walk / Exercise', time: '18:00', category: 'Exercise', completed: false, updatedAt: now() }
];

export const demoMoods: MoodEntry[] = [
  { id: 'mood-1', patientId: demoPatient.id, entryDate: daysAgo(3), mood: 'Okay', note: 'Calm morning routine.', updatedAt: now() },
  { id: 'mood-2', patientId: demoPatient.id, entryDate: daysAgo(2), mood: 'Good', note: 'Enjoyed family photos.', updatedAt: now() },
  { id: 'mood-3', patientId: demoPatient.id, entryDate: daysAgo(1), mood: 'Neutral', note: 'Needed a hydration reminder.', updatedAt: now() }
];

export const demoResults: GameResult[] = demoGames.map((game, index) => ({
  id: `result-demo-${index}`,
  patientId: demoPatient.id,
  gameId: game.id,
  gameName: game.name,
  sessionId: `session-demo-${index}`,
  clientOperationId: `seed-result-${index}`,
  accuracy: Math.min(94, 64 + index * 5),
  responseTimeSeconds: Math.max(24, 48 - index * 3),
  attempts: Math.max(2, 6 - (index % 3)),
  score: Math.min(96, 64 + index * 5),
  hintsUsed: index % 2,
  difficulty: Math.min(5, 1 + (index % 3)),
  sessionDurationSeconds: 80 + index * 9,
  summary: 'Demo progress sample for activity tracking.',
  createdAt: new Date(Date.now() - (index + 1) * 86_400_000).toISOString(),
  updatedAt: now()
}));

export const demoAlerts: CaregiverAlert[] = [
  {
    id: 'alert-memory-activity',
    patientId: demoPatient.id,
    message: "Patient has not completed today's cognitive activity.",
    severity: 'INFO',
    resolved: false,
    generatedAt: now(),
    updatedAt: now()
  }
];

