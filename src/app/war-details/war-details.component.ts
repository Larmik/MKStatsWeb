import { Component, OnInit, Output, inject } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { War, WarPosition, WarTrack } from '../../models/war';
import { LocalService } from '../../service/local.service';
import { HeaderComponent } from '../header/header.component';
import { WarTrackFormComponent } from '../war-track-form/war-track-form.component';
import { Player } from '../../models/team';
import { NgFor } from '@angular/common';
import { WarTrackItemComponent } from '../war-track-item/war-track-item.component';
import { DatabaseService } from '../../service/database.service';

@Component({
  selector: 'app-war-details',
  standalone: true,
  imports: [
    NgFor,
    HeaderComponent,
    WarTrackFormComponent,
    WarTrackItemComponent,
  ],
  templateUrl: './war-details.component.html',
  styleUrl: './war-details.component.scss',
})
export class WarDetailsComponent implements OnInit {
  @Output() id: string | null = '';
  war!: War;
  players!: Player[];
  warTracks!: WarTrack[];
  database: DatabaseService = inject(DatabaseService);
  local: LocalService = inject(LocalService);
  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    let roster = this.local.getPlayers().flatMap((roster) => roster.players);
    let allies = this.local.getAllies();
    let currentPlayers: Player[] = [];

    this.route.paramMap.subscribe((params: ParamMap) => {
      this.id = params.get('id');
      this.database.getWar(this.id ?? '').subscribe((entity) => {
        if (entity) {
          let war = War.fromEntity(entity);
          console.log(war.warTracks)
          war.warTracks.forEach((track: WarTrack) => {
            track.warPositions
              ?.sort((a, b) => ((a.position ?? 0) < (b.position ?? 0) ? -1 : 1))
              .forEach((pos: WarPosition) => {
                let player =
                  roster.find(
                    (player: Player) =>
                      player.player_id.toString() == pos.playerId
                  ) ??
                  allies.find(
                    (player: Player) =>
                      player.player_id.toString() == pos.playerId
                  );
                if (player && !currentPlayers.includes(player))
                  currentPlayers.push(player);
              });
          });
          this.war = war;
          this.players = currentPlayers;
          this.warTracks = this.war.warTracks;
        }
      });
    });
  }
}
