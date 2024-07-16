import { Injectable } from '@angular/core';
import { TeamEntity, WarEntity, db } from '../db';
import { War } from '../models/war';
import { Observable, from } from 'rxjs';
import { Team } from '../models/team';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  public async writeWars(wars: War[]) {
    await db.wars.bulkAdd(wars.map((war) => War.toEntity(war)));
  }

  public async writeTeams(teams: Team[]) {
    await db.teams.bulkAdd(teams.map((team) => Team.toEntity(team)));
  }

  public getWars(): Observable<WarEntity[]> {
    return from(db.wars.toArray());
  }

  public getTeams(): Observable<TeamEntity[]> {
    return from(db.teams.toArray());
  }

  public getWar(warId: string): Observable<WarEntity | undefined> {
    return from(db.wars.where({ mid: warId }).first());
  }

  public getTeam(id: string): Observable<TeamEntity | undefined> {
    return from(db.teams.where({ mid: id }).first());
  }

  public async clear() {
    await db.wars.clear();
  }
}
