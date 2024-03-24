import { Component, Inject, Input, OnInit, inject } from '@angular/core';
import { PlayerItemComponent } from '../player-item/player-item.component';
import { MatDialogModule } from '@angular/material/dialog';
import { LocalService } from '../../service/local.service';
import { User } from '../../models/user';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { FirebaseService } from '../../service/firebase.service';

@Component({
  selector: 'app-sub-player',
  standalone: true,
  imports: [
    PlayerItemComponent,
    MatDialogModule,
    NgFor,
    NgIf,
    NgClass,
    MatButtonModule,
  ],
  templateUrl: './sub-player.component.html',
  styleUrl: './sub-player.component.scss',
})
export class SubPlayerComponent implements OnInit {
  local: LocalService = inject(LocalService);
  currentPlayers!: User[];
  remainingPlayers!: User[];
  oldPlayer?: User;
  newPlayer?: User;
  users?: User[];
  firebase: FirebaseService = inject(FirebaseService);

  ngOnInit(): void {
    this.users = this.local.getUsers();
    this.currentPlayers = this.local.getCurrentPlayers();
    this.remainingPlayers = this.users.filter(
      (user) =>
        !this.currentPlayers.map((player) => player.mkcId).includes(user.mkcId)
    );
  }

  onOldPlayerSelected(player: User) {
    this.oldPlayer = player;
  }

  onNewPlayerSelected(player: User) {
    this.newPlayer = player;
  }

  onValidateSub() {
    let usersToWrite: User[] = [];
    let war = this.local.getCurrentWar();
    this.currentPlayers.forEach((player: User) => {
      if (player.mkcId == this.oldPlayer?.mkcId) {
        player.currentWar = '-1';
      }
      usersToWrite.push(player);
    });
    let newPlayer = this.newPlayer;
    if (newPlayer) {
      newPlayer.currentWar = war?.mid;
      usersToWrite.push(newPlayer);
    }
    usersToWrite.forEach((user) => {
      this.firebase.writeUser(user);
    });
    this.local.saveCurrentPlayers(usersToWrite);
    setTimeout(function () {
      window.location.reload();
    }, 100);
  }
}
