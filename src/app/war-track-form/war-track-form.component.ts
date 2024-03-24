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
  selector: 'app-war-track-form',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    NgFor,
    SelectTrackComponent,
    NgClass,
    NgIf,
    TrackItemComponent,
    ScoreItemComponent,
  ],
  templateUrl: './war-track-form.component.html',
  styleUrl: './war-track-form.component.scss',
})
export class WarTrackFormComponent implements OnInit {
  isActivated!: Boolean;
  map!: any;
  track!: WarTrack;
  positions!: Map<string, number>;
  shocks!: Map<string, number>;
  local: LocalService = inject(LocalService);
  firebase: FirebaseService = inject(FirebaseService);
  constructor(public dialog: MatDialog) {}
  players!: Player[];
  @Input() index!: number;

  private maps!: any[];

  ngOnInit(): void {
    let currentWar = this.local.getCurrentWar();
    let users = this.local.getCurrentPlayers();
    let roster = this.local.getPlayers();
    let allies = this.local.getAllies();

    let track = currentWar?.warTracks[this.index - 1];
    let positions = track?.warPositions;
    let shocks = track?.shocks;
    let posMap = new Map<string, number>();
    let shockMap = new Map<string, number>();
    let playersToShow: Player[] = [];
    users.forEach((user: User) => {
      let player =
        roster.find(
          (player: Player) => player.player_id.toString() == user.mkcId
        ) ??
        allies.find(
          (player: Player) => player.player_id.toString() == user.mkcId
        );

      if (player) {
        //on affiche
        //si le current war du joueur est bon
        //ou que les positions de la track est de taille 6 et qu'il contient l'id du joueur

        //On affiche pas
        // si le current war du joueur est bon et que les positionsde la track est de taille 6 et qu'il ne contient pas l'id du joueur

        let playersIdForPos = positions?.map((pos) => pos.playerId);
        let shouldAdd =
          user.currentWar == currentWar?.mid ||
          (playersIdForPos?.length == 6 &&
            playersIdForPos.includes(player.player_id.toString()));
        let shouldNotAdd =
          user.currentWar == currentWar?.mid &&
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

    if (track) this.track = track;
    this.isActivated = (currentWar?.warTracks.length ?? 0) >= this.index - 1;
    this.maps = [...Maps.values()];
    let map = this.maps.find(
      (map: any) =>
        map.index == currentWar?.warTracks[this.index - 1]?.trackIndex
    );
    this.map = map;
    this.positions = posMap;
    this.shocks = shockMap;
    this.players = playersToShow;
  }

  openDialog(warTrackIndex: number) {
    if (this.isActivated) {
      let config = new MatDialogConfig();
      config.minWidth = '75%';
      config.data = warTrackIndex;
      let dialogRef = this.dialog.open(SelectTrackComponent, config);
      dialogRef.afterClosed().subscribe((result: any) => {
        let currentWar = this.local.getCurrentWar();
        let map: any;
        if (warTrackIndex - 1 == currentWar?.warTracks.length)
          map = this.maps.find(
            (map: any) =>
              map.index == this.local.getCurrentWarTrack()?.trackIndex
          );
        else
          map = this.maps.find(
            (map: any) =>
              map.index == currentWar?.warTracks[warTrackIndex - 1]?.trackIndex
          );
        this.map = map;
      });
    }
  }

  onValidateTrack(warTrackIndex: number, mapIndex: number) {
    let currentTrack = this.local.getCurrentWarTrack();
    let currentWar = this.local.getCurrentWar();
    let positions: WarPosition[] = [];
    let shocks: WarShock[] = [];
    if (currentWar && currentTrack) {
      this.players.forEach((player: Player) => {
        let posForPlayer = (<HTMLInputElement>(
          document.getElementById(
            player.player_id.toString() + '_position' + warTrackIndex
          )
        )).value;
        let shockForPlayer = (<HTMLInputElement>(
          document.getElementById(
            player.player_id.toString() + '_shock' + warTrackIndex
          )
        )).value;
        if (
          +posForPlayer >= 1 &&
          +posForPlayer <= 12 &&
          !positions
            .map((position: WarPosition) => position.position)
            .includes(+posForPlayer)
        )
          positions.push(
            WarPosition.create(player.player_id.toString(), +posForPlayer)
          );
        else
          console.log(
            'Error, position fields must be between 1 and 12 and all differents'
          );
        if (shockForPlayer.length == 1)
          shocks.push(
            WarShock.create(player.player_id.toString(), +shockForPlayer)
          );
      });
      if (warTrackIndex > currentWar?.warTracks.length) {
        console.log('creating new track');
        if (positions.length == 6) {
          currentTrack = WarTrack.addPositionsAndShocks(
            currentTrack,
            positions,
            shocks
          );
          currentWar = War.addTrack(currentWar, currentTrack, warTrackIndex);
        }
      } else {
        console.log('editing existing track');
        let map = this.maps.find((map: any) => map.index == mapIndex);
        let trackToEdit = currentWar.warTracks[warTrackIndex - 1];
        trackToEdit.trackIndex = map.index;
        if (positions.length == 6) {
          trackToEdit = WarTrack.addPositionsAndShocks(
            trackToEdit,
            positions,
            shocks
          );
          currentWar = War.addTrack(currentWar, trackToEdit, warTrackIndex);
        }
      }
      this.local.saveCurrentWar(currentWar);
      this.firebase.writeCurrentWar(currentWar);
      setTimeout(function () {
        window.location.reload();
      }, 500);
    }
  }
}
