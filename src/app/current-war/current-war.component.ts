import { Component, OnChanges, OnInit, SimpleChanges, inject } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FirebaseService } from '../../service/firebase.service';
import { War, WarTrack } from '../../models/war';
import { WarItemComponent } from '../war-item/war-item.component';
import { LocalService } from '../../service/local.service';
import { User } from '../../models/user';
import { Player } from '../../models/team';
import { NgFor } from '@angular/common';
import { user } from '@angular/fire/auth';
import { PlayersScoresComponent } from '../players-scores/players-scores.component';
import { WarTrackFormComponent } from '../war-track-form/war-track-form.component';

@Component({
  selector: 'app-current-war',
  standalone: true,
  imports: [HeaderComponent, WarItemComponent, NgFor, PlayersScoresComponent, WarTrackFormComponent],
  templateUrl: './current-war.component.html',
  styleUrl: './current-war.component.scss'
})
export class CurrentWarComponent implements OnInit {
  war!: War
  players!: Player[]
  warTracks!: WarTrack[]
  canEdit!: Boolean

  firebase: FirebaseService = inject(FirebaseService)
  local: LocalService = inject(LocalService)



  ngOnInit(): void {
    let current = this.local.getCurrentWar()
    let users = this.local.getCurrentPlayers()
    let roster = this.local.getPlayers().flatMap(roster => roster.players)
    let allies = this.local.getAllies()
    let currentPlayers: Player[] = []
    let warTracks: WarTrack[] = new Array(12)
    
    users.forEach((user: User) => {
      let player = roster.find((player: Player) => player.player_id.toString() == user.mkcId) ?? allies.find((player: Player) => player.player_id.toString() == user.mkcId)

      if (player) currentPlayers.push(player)
    })
    if (current) {
      this.canEdit = current.playerHostId == this.local.getCurrentUser()?.mkcId
      this.war = current
      this.players = currentPlayers
      this.warTracks = warTracks
    }
   
  }

}
