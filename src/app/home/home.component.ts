import { Component, OnInit, inject } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FirebaseService } from '../../service/firebase.service';
import { War } from '../../models/war';
import { Roster, Team } from '../../models/team';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { LastResultsComponent } from '../last-results/last-results.component';
import { WarStatsComponent } from '../war-stats/war-stats.component';
import { CreateWarComponent } from '../create-war/create-war.component';
import { LocalService } from '../../service/local.service';
import { NgFor, NgIf } from '@angular/common';
import { PlayerListComponent } from '../player-list/player-list.component';
import { MKCentralService } from '../../service/mkcentral.service';
import { CurrentWarItemComponent } from '../current-war-item/current-war-item.component';
import { AuthService } from '../../service/auth.service';
import { DatabaseService } from '../../service/database.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeaderComponent,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    LastResultsComponent,
    WarStatsComponent,
    PlayerListComponent,
    CreateWarComponent,
    CurrentWarItemComponent,
    NgIf,
    NgFor,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  wars!: War[];
  team?: Team;
  players!: Roster[];
  createWarVisible!: Boolean;
  currentWars!: War[];

  database: FirebaseService = inject(FirebaseService);
  newDatabase: DatabaseService = inject(DatabaseService)
  local: LocalService = inject(LocalService);
  service: MKCentralService = inject(MKCentralService);
  auth: AuthService = inject(AuthService);
  router: Router = inject(Router);

  ngOnInit(): void {
    this.wars = [];
    this.currentWars = [];
    let finalWars: War[] = [];
    let finalCurrentWars: War[] = [];
    this.team = this.local.getTeam();
    this.players = this.local.getPlayers();
    let userRole = this.local.getCurrentUser()?.role ?? 0;
    if (!this.local.isSessionValid()) {
      this.logout()
    }
    if (this.team?.id) {
      this.database
        .getWars(this.team?.id.toString())
        .subscribe((wars: War[]) => {
          wars.forEach((war) => {
            finalWars.push(war);
          });

          this.wars = finalWars.sort((a, b) => (a.mid > b.mid ? -1 : 1));
          this.newDatabase.writeWars(this.wars)
          console.log(this.wars);
        });
      if (this.team?.primary_team_id) {
        this.database
          .getWars(this.team?.primary_team_id.toString())
          .subscribe((wars: War[]) => {
            wars.forEach((war) => {
              finalWars.push(war);
            });
            this.wars = finalWars.sort((a, b) => (a.mid > b.mid ? -1 : 1));
            this.newDatabase.writeWars(this.wars)
            console.log(this.wars);
          });
        this.database
          .getCurrentWar(this.team?.primary_team_id.toString())
          .subscribe((war: War) => {
            if (war) finalCurrentWars.push(war);

            this.currentWars = finalCurrentWars;
            this.createWarVisible =
              userRole >= 1 &&
              this.currentWars.filter(
                (war) => war.teamHost == this.team?.id.toString()
              ).length == 0;
          });
      }
      if (this.team?.secondary_teams) {
        this.team?.secondary_teams.forEach((team: any) => {
          this.database.getWars(team.id.toString()).subscribe((wars: War[]) => {
            wars.forEach((war) => {
              finalWars.push(war);
            });

            this.wars = finalWars.sort((a, b) => (a.mid > b.mid ? -1 : 1));
            this.newDatabase.writeWars(this.wars)
            console.log(this.wars);
          });
          this.database
            .getCurrentWar(team.id.toString())
            .subscribe((war: War) => {
              if (war) finalCurrentWars.push(war);
              this.currentWars = finalCurrentWars;
              this.createWarVisible =
                userRole >= 1 &&
                this.currentWars.filter(
                  (war) => war.teamHost == this.team?.id.toString()
                ).length == 0;
            });
        });
      }
      this.database
        .getCurrentWar(this.team.id.toString())
        .subscribe((war: War) => {
          if (war) finalCurrentWars.push(war);
          this.currentWars = finalCurrentWars;
          this.createWarVisible =
            userRole >= 1 &&
            this.currentWars.filter(
              (war) => war.teamHost == this.team?.id.toString()
            ).length == 0;
        });
    }
  }

  logout() {
    this.auth.logout();
    this.local.clearAll();
    this.newDatabase.clear()
    this.router.navigate(['']);
  }
}


