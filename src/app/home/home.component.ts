import { Component, OnInit, inject } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FirebaseService } from '../../service/firebase.service';
import { War } from '../../models/war';
import { Player, Team } from '../../models/team';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { LastResultsComponent } from '../last-results/last-results.component';
import { WarStatsComponent } from '../war-stats/war-stats.component';
import { PlayerListComponent } from '../player-list/player-list.component';
import { CreateWarComponent } from '../create-war/create-war.component';
import { LocalService } from '../../service/local.service';
import { NgIf } from '@angular/common';

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
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  wars!: War[];
  team?: Team;
  players!: Player[];
  createWarVisible!: Boolean;

  database: FirebaseService = inject(FirebaseService);
  local: LocalService = inject(LocalService);

  ngOnInit(): void {
    this.wars = [];
    this.database.getWars().subscribe((wars: War[]) => {
      this.wars = wars;
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
