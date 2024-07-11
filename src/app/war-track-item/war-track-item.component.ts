import { Component, Input, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Player } from '../../models/team';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SelectTrackComponent } from '../select-track/select-track.component';
import { LocalService } from '../../service/local.service';
import { Maps } from '../../models/maps';
import { War, WarPosition, WarShock, WarTrack } from '../../models/war';
import { TrackItemComponent } from '../track-item/track-item.component';
import { ScoreItemComponent } from '../score-item/score-item.component';
import { User } from '../../models/user';
import { FirebaseService } from '../../service/firebase.service';
import { delay } from 'rxjs';

@Component({
  selector: 'app-war-track-item',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    NgFor,
    SelectTrackComponent,
    NgClass,
    NgIf,
    TrackItemComponent,
    ScoreItemComponent
  ],
  templateUrl: './war-track-item.component.html',
  styleUrl: './war-track-item.component.scss'
})
export class WarTrackItemComponent implements OnInit {
  isActivated!: Boolean;
  map!: any;
  @Input() track!: WarTrack;
  positions!: Map<string, number>;
  shocks!: Map<string, number>;
  local: LocalService = inject(LocalService);
  firebase: FirebaseService = inject(FirebaseService);
  constructor(public dialog: MatDialog) {}
  players!: Player[];
  @Input() index!: number;
  @Input() disabled!: Boolean;

  private maps!: any[];

  ngOnInit(): void {
    let roster = this.local.getPlayers().flatMap(roster => roster.players);
    let allies = this.local.getAllies();

   
    let positions = this.track?.warPositions;
    let shocks = this.track?.shocks;
    let posMap = new Map<string, number>();
    let shockMap = new Map<string, number>();
    let playersToShow: Player[] = [];
    this.track.warPositions?.forEach((pos: WarPosition) => {
      let player =
        roster.find(
          (player: Player) => player.player_id.toString() == pos.playerId
        ) ??
        allies.find(
          (player: Player) => player.player_id.toString() == pos.playerId
        );

      if (player) {
        //on affiche
        //si le current war du joueur est bon
        //ou que les positions de la track est de taille 6 et qu'il contient l'id du joueur

        //On affiche pas
        // si le current war du joueur est bon et que les positionsde la track est de taille 6 et qu'il ne contient pas l'id du joueur

        let playersIdForPos = positions?.map((pos) => pos.playerId);
        let shouldAdd =
          
          (playersIdForPos?.length == 6 &&
            playersIdForPos.includes(player.player_id.toString()));
        let shouldNotAdd =
         
          playersIdForPos?.length == 6 &&
          !playersIdForPos.includes(player.player_id.toString());
        if (shouldAdd && !shouldNotAdd) playersToShow.push(player);
      }
    });

    positions?.forEach((pos: WarPosition) => {
      if (pos.playerId && pos.position) posMap.set(pos.playerId, pos.position);
    });
    shocks?.forEach((shock: WarShock) => {
      if (shock.playerId && shock.count)
        shockMap.set(shock.playerId, shock.count);
    });

    this.maps = [...Maps.values()];
    let map = this.maps.find(
      (map: any) =>
        map.index == this.track.trackIndex
    );
    this.map = map;
  
    this.positions = posMap;
    this.shocks = shockMap;
    this.players = playersToShow;
  }

}
