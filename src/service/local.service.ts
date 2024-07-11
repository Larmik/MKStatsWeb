import { Injectable } from '@angular/core';
import { War, WarTrack } from '../models/war';
import { Player, Roster, Team } from '../models/team';
import { User } from '../models/user';


@Injectable({
  providedIn: 'root',
})
export class LocalService {
  //List setters methods

  public savePlayers(players: Roster[]) {
    let rawString = JSON.stringify(players);
    localStorage.setItem('players', rawString);
  }

  public saveUsers(users: User[]) {
    let rawString = JSON.stringify(users);
    localStorage.setItem('users', rawString);
  }

  public saveAllies(allies: Player[]) {
    let rawString = JSON.stringify(allies);
    localStorage.setItem('allies', rawString);
  }

  public saveWars(wars: War[]) {
    console.log('saving wars' + wars)
    let rawString = JSON.stringify(wars);
    localStorage.setItem('wars', rawString);
  }

  public saveCurrentUser(user: User) {
    let rawString = JSON.stringify(user);
    localStorage.setItem('user', rawString);
    localStorage.setItem('sessionStart', String(new Date().getTime()))
  }

  public saveCurrentWar(war: War) {
    let rawString = JSON.stringify(war);
    localStorage.setItem('war', rawString);
  }

  public saveCurrentWarTrack(track: WarTrack) {
    let rawString = JSON.stringify(track);
    localStorage.setItem('warTrack', rawString);
  }

  public saveCurrentPlayers(user: User[]) {
    let rawString = JSON.stringify(user);
    localStorage.setItem('currentPlayers', rawString);
  }

  public saveTeam(team: Team) {
    let rawString = JSON.stringify(team);
    localStorage.setItem('team', rawString);
  }

  public getPlayers(): Roster[] {
    let rawString = localStorage.getItem('players');
    if (rawString != null) return JSON.parse(rawString);
    return [];
  }

  public getUsers(): User[] {
    let rawString = localStorage.getItem('users');
    if (rawString != null) return JSON.parse(rawString);
    return [];
  }

  public getAllies(): Player[] {
    let rawString = localStorage.getItem('allies');
    if (rawString != null) return JSON.parse(rawString);
    return [];
  }

  public getTeam(): Team | undefined {
    let rawString = localStorage.getItem('team');
    if (rawString != null) return JSON.parse(rawString);
    return undefined;
  }

  public getWars(): War[] {
    let rawString = localStorage.getItem('wars');
    if (rawString != null) return JSON.parse(rawString);
    return [];
  }

  public getCurrentUser(): User | undefined {
    let rawString = localStorage.getItem('user');
    if (rawString != null) return JSON.parse(rawString);
    return undefined;
  }

  public getCurrentWar(): War | undefined {
    let rawString = localStorage.getItem('war');
    if (rawString != null) return JSON.parse(rawString);
    return undefined;
  }

  public getCurrentPlayers(): User[] {
    let rawString = localStorage.getItem('currentPlayers');
    if (rawString != null) return JSON.parse(rawString);
    return [];
  }

  public getCurrentWarTrack(): WarTrack | undefined {
    let rawString = localStorage.getItem('warTrack');
    if (rawString != null) return JSON.parse(rawString);
    return undefined;
  }

  public clearCurrentWar() {
    localStorage.removeItem('war');
  }

  public clearCurrentTrack() {
    localStorage.removeItem('warTrack');
  }

  public clearCurrentPlayers() {
    localStorage.removeItem('currentPlayers');
  }

  public clearAll() {
    localStorage.clear();
  }

  public isSessionValid() {
    var sessionStart = Number(localStorage.getItem('sessionStart'))
    var minute =  new Date().getTime() - (1 * 24 * 60 * 60 * 1000)
    console.log(minute - sessionStart)
    return (minute-sessionStart) < 0 && sessionStart != 0
  }
}
