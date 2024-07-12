import Dexie, { Table } from 'dexie';

export class WarEntity {
    mid: string = '' 
    playerHostId: string  = '' 
    teamHost: string  = '' 
    teamOpponent: string  = '' 
    createdDate: string  = '' 
    warTracks: string = ''
    penalties: string = ''
    isOfficial: boolean = false
    scoreHost?: number;
    scoreOpponent?: number;
    displayedDiff?: string;
}
export class AppDB extends Dexie {
  wars!: Table<WarEntity, number>;

  constructor() {
    super('ngdexieliveQuery');
    this.version(1).stores({
      wars: 'mid, playerHostId, teamHost, teamOpponent, createdDate, isOfficial, warTracks, penalties, scoreHost, scoreOpponent, displayedDiff'
    });
  }

  
}

export const db = new AppDB();