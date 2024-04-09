import { Component, OnInit, inject } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FirebaseService } from '../../service/firebase.service';
import { War } from '../../models/war';
import { Roster, Team } from '../../models/team';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { LastResultsComponent } from '../last-results/last-results.component';
import { WarStatsComponent } from '../war-stats/war-stats.component';
import { CreateWarComponent } from '../create-war/create-war.component';
import { LocalService } from '../../service/local.service';
import { NgFor, NgIf } from '@angular/common';
import { PlayerListComponent } from '../player-list/player-list.component';
import { MKCentralService } from '../../service/mkcentral.service';

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

  database: FirebaseService = inject(FirebaseService);
  local: LocalService = inject(LocalService);
  service: MKCentralService = inject(MKCentralService);

  ngOnInit(): void {
    this.wars = [];
    let finalWars: War[] = [];
    let team = this.local.getTeam();
    console.log(team)
    if (team?.id)
      this.database.getWars(team?.id.toString()).subscribe((wars: War[]) => {
        wars.forEach((war) => {
          finalWars.push(war);
        });
        if (team?.primary_team_id) {
          this.database
            .getWars(team?.primary_team_id.toString())
            .subscribe((wars: War[]) => {
              wars.forEach((war) => {
                finalWars.push(war);
              });
              this.wars = finalWars.sort((a, b) => a.mid > b.mid ? -1 : 1)
            });
        } else if (team?.secondary_teams) {
          team?.secondary_teams.forEach((team: any) => {
            this.database
            .getWars(team.id.toString())
            .subscribe((wars: War[]) => {
              wars.forEach((war) => {
                finalWars.push(war);
              });
              this.wars = finalWars.sort((a, b) => a.mid > b.mid ? -1 : 1)
            });
          })
        } else 
          this.wars = finalWars.sort((a, b) => a.mid > b.mid ? -1 : 1)
      });

    this.database.getCurrentWar().subscribe((war: War) => {
      this.local.saveCurrentWar(war);
    });
    this.team = this.local.getTeam();
    this.players = this.local.getPlayers();
    let userRole = this.local.getCurrentUser()?.role ?? 0;
    this.createWarVisible = userRole >= 1;
    this.database.getCurrentWar().subscribe((war) => {
      if (war) this.createWarVisible = false;
    });
  }
}