import { Component, Inject, OnInit, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Player, Team } from '../../models/team';
import { NgFor, NgIf } from '@angular/common';
import { PlayerItemComponent } from '../player-item/player-item.component';
import { LocalService } from '../../service/local.service';
import { War } from '../../models/war';
import { FirebaseService } from '../../service/firebase.service';
import { User } from '../../models/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-select-player',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule, PlayerItemComponent, NgFor, NgIf],
  templateUrl: './select-player.component.html',
  styleUrl: './select-player.component.scss',
})
export class SelectPlayerComponent implements OnInit {
  players!: Player[];
  allies!: Player[];
  isLineupValid!: Boolean;

  selectedPlayers: Player[] = [];
  users: User[] = [];

  firebase: FirebaseService = inject(FirebaseService);
  local: LocalService = inject(LocalService);
  router: Router = inject(Router);

  constructor(@Inject(MAT_DIALOG_DATA) public data: string) {}

  ngOnInit(): void {
    this.players = this.local.getPlayers();
    this.allies = this.local.getAllies();
    this.users = this.local.getUsers();
    this.sortPlayers();
  }

  onPlayerSelected(player: Player) {
    if (!this.selectedPlayers.includes(player)) {
      switch (player.isAlly) {
        case true: {
          let index = this.allies.indexOf(player);
          this.allies.splice(index, 1);
          break;
        }
        default: {
          let index = this.players.indexOf(player);
          this.players.splice(index, 1);
          break;
        }
      }
      this.selectedPlayers.push(player);
    } else {
      let index = this.selectedPlayers.indexOf(player);
      this.selectedPlayers.splice(index, 1);
      switch (player.isAlly) {
        case true: {
          this.allies.push(player);
          break;
        }
        default: {
          this.players.push(player);
          break;
        }
      }
    }
    this.sortPlayers();
  }

  onValidateWar() {
    let playerId = this.local.getCurrentUser()?.mkcId;
    let teamId = this.local.getTeam()?.id;
    if (playerId && teamId) {
      let war = War.create(playerId, teamId?.toString(), this.data.toString());
      let usersToWrite: User[] = [];
      this.firebase.writeCurrentWar(war);
      this.local.saveCurrentWar(war);
      this.selectedPlayers.forEach((player: Player) => {
        let user = this.users.find(
          (user: User) => user.mkcId == player.player_id.toString()
        );
        if (user) {
          user.currentWar = war.mid;
          usersToWrite.push(user);
        } else {
          let userFromAlly = User.fromPlayer(player);
          userFromAlly.currentWar = war.mid;
          usersToWrite.push(userFromAlly);
        }
      });
      usersToWrite.forEach((user) => {
        this.firebase.writeUser(user);
      });
      this.local.saveCurrentPlayers(usersToWrite);
      this.router.navigate(['/currentWar']);
    }
  }

  private sortPlayers() {
    this.players.sort((a, b) => {
      if (a.display_name > b.display_name) return 1;
      if (a.display_name < b.display_name) return -1;
      return 0;
    });
    this.allies.sort((a, b) => {
      if (a.display_name > b.display_name) return 1;
      if (a.display_name < b.display_name) return -1;
      return 0;
    });
    this.selectedPlayers.sort((a, b) => {
      if (a.display_name > b.display_name) return 1;
      if (a.display_name < b.display_name) return -1;
      return 0;
    });
    this.isLineupValid = this.selectedPlayers.length == 6;
  }
}
