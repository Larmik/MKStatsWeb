export class Team {
  id: number;
  primary_team_id: number;
  primary_team_name: string;
  team_name: string;
  team_tag: string;
  team_color: 6;
  team_description: string;
  team_logo: string;
  main_language: string;
  recruitment_status: string;
  team_status: string;
  is_historical: number;
  secondary_teams: any[];
  roster: Player[];

  constructor(obj: any) {
    this.id = obj.id;
    this.primary_team_id = obj.primary_team_id;
    this.team_name = obj.team_name;
    this.primary_team_name = obj.primary_team_name;
    this.team_tag = obj.team_tag;
    this.team_color = obj.team_color;
    this.team_description = obj.team_description;
    this.team_logo = obj.team_logo;
    this.main_language = obj.main_language;
    this.recruitment_status = obj.recruitment_status;
    this.team_status = obj.team_status;
    this.is_historical = obj.is_historical;
    this.secondary_teams = obj.secondary_teams
    if (obj.rosters && obj.rosters['150cc'])
    this.roster = obj.rosters['150cc'].members.map(
      (player: any) => new Player(player, false)
    );
    else this.roster = []
  }
}

export class Roster {
  team!: any
  players!: Player[]

  constructor(team: any, players: Player[]) {
    this.team = team
    this.players = players
  }
}

export class Player {
  player_id: number;
  display_name: string;
  custom_field_name: string;
  custom_field: string;
  player_status: string;
  registered_since: string;
  registered_since_human: string;
  country_code: string;
  country_name: string;
  team_leader: number;
  isAlly: Boolean;

  constructor(obj: any, isAlly: Boolean) {
    this.player_id = obj.player_id != undefined ? obj.player_id : obj.id;
    this.display_name = obj.display_name;
    this.custom_field_name = obj.custom_field_name;
    this.player_status = obj.player_status;
    this.custom_field = obj.custom_field;
    this.registered_since = obj.registered_since;
    this.registered_since_human = obj.registered_since_human;
    this.country_code = obj.country_code;
    this.country_name = obj.country_name;
    this.team_leader = obj.team_leader;
    this.isAlly = isAlly;
  }
}
