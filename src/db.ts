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
export class WarTrackEntity {
  mid: string = ''
  trackIndex?: number;
  warPositions: string = '';
  shocks: string = '';
  teamScore?: number;
  opponentScore?: number;
  diffScore?: number;
}
export class TeamEntity {
  mid: string = '';
  primary_team_id: number = 0;
  primary_team_name: string = '';
  team_name: string = '';
  team_tag: string = '';
  team_color: number = 6;
  team_description: string = '';
  team_logo: string = '';
  main_language: string = '';
  recruitment_status: string = '';
  team_status: string = '';
  is_historical: number = 0;
}
export class AppDB extends Dexie {
  wars!: Table<WarEntity, number>;
  teams!: Table<TeamEntity, number>;

  constructor() {
    super('ngdexieliveQuery');
    this.version(2).stores({
      wars: 'mid, playerHostId, teamHost, teamOpponent, createdDate, isOfficial, warTracks, penalties, scoreHost, scoreOpponent, displayedDiff',
      teams: 'mid, primary_team_id, primary_team_name, team_tag, team_color, team_description, team_logo, main_language, recruitment_status, team_status, is_historical'
    });
  }

  
}

export const db = new AppDB();