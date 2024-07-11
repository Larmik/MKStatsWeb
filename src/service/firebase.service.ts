import { Injectable, inject } from '@angular/core';
import {
  Database,
  get,
  ref,
  set,
} from '@angular/fire/database';
import { Observable, from } from 'rxjs';
import { War } from '../models/war';
import { User } from '../models/user';
import { LocalService } from './local.service';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  private database: Database = inject(Database);
  private local: LocalService = inject(LocalService);

  public writeCurrentWar(war: War) {
    let teamId = this.local.getTeam()?.id;
    const currentWarRef = ref(this.database, 'currentWars/' + teamId);
    set(currentWarRef, war);
  }
  public deleteCurrentWar() {
    let teamId = this.local.getTeam()?.id;
    const currentWarRef = ref(this.database, 'currentWars/' + teamId);
    set(currentWarRef, null);
  }

  public writeWar(war: War) {
    let teamId = this.local.getTeam()?.id;
    const warData = ref(this.database, 'newWars/' + teamId + '/' + war.mid);
    set(warData, war);
  }

  public writeUser(user: User) {
    const userRef = ref(this.database, 'users/' + user.mid);
    set(userRef, user);
  }

  public getCurrentWar(teamId: String): Observable<War> {
    const warData = ref(this.database, 'currentWars/' + teamId);
    let war: War;
    let promise = get(warData).then((snapshot) => {
      if (snapshot.exists()) {
        war = War.fromDatasnapshot(snapshot);
      }
      return war;
    });
    return from(promise);
  }

  public getUsers(): Observable<User[]> {
    const userRef = ref(this.database, 'users');
    const users: User[] = new Array(0);
    let promise = get(userRef).then((snapshot) => {
      if (snapshot.exists()) {
        snapshot.forEach((user) => {
          let newUser = User.fromDatasnapshot(user);
          users.push(newUser);
        });
      }
      return users;
    });
    return from(promise);
  }

  public getAllies(): Observable<string[]> {
    let team = this.local.getTeam()
    let teamId = team?.id ?? team?.primary_team_id
    console.log(team)
    const allyData = ref(this.database, 'allies/' + teamId);
    const allies = new Array(0);
    let promise = get(allyData).then((snapshot) => {
      if (snapshot.exists()) {
        snapshot.forEach((ally) => {
          let allyString = ally.val();
          if (allyString.length < 6) allies.push(allyString);
        });
      }
      console.log(allies)
      return allies;
    });
    return from(promise);
  }

  public getWar(teamId: string, warId: string): Observable<War> {
    const warData = ref(this.database, 'newWars/' + teamId + '/' + warId);
    const wars: War[] = new Array(0);
    let promise = get(warData).then((snapshot) => {
      if (snapshot.exists()) {
       wars.push(War.fromDatasnapshot(snapshot))
      }
      return wars[0];
    });
    return from(promise);
  }

  public getWars(teamId: string): Observable<War[]> {
    const warData = ref(this.database, 'newWars/' + teamId);
    const wars: War[] = new Array(0);
    let promise = get(warData).then((snapshot) => {
      if (snapshot.exists()) {
        snapshot.forEach((war) => {
          let newWar = War.fromDatasnapshot(war);
          wars.push(newWar);
        });
      }
      return wars.reverse();
    });
    return from(promise);
  }
}
