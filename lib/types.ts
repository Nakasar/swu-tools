export interface Set {
  code: string;
  name: string;
  releaseDate: string;
  totalCards: number;
  imageUrl?: string;
}

export interface Card {
  id: string;
  setCode: string;
  number: string;
  name: string;
  type: string;
  aspects?: string[];
  cost?: number;
  power?: number;
  hp?: number;
  rarity: string;
  imageUrl?: string;
}

export interface Player {
  id: string;
  name: string;
  email?: string;
  poolPhotoUrl?: string;
  decklistPhotoUrl?: string;
  deckChecks: DeckCheck[];
}

export interface DeckCheck {
  id: string;
  timestamp: string;
  photoUrl: string;
  notes?: string;
}

export interface LimitedEvent {
  id: string;
  name: string;
  date: string;
  format: 'sealed' | 'draft';
  creatorEmail: string;
  judges: string[];
  players: Player[];
  createdAt: string;
  updatedAt: string;
}

export interface TimerSettings {
  duration: number; // in seconds
  warningTime?: number; // seconds before end to show warning
}
