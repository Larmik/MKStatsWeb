import {
  Component,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  inject,
} from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { War, WarPosition, WarTrack } from '../../models/war';
import { LocalService } from '../../service/local.service';
import { HeaderComponent } from '../header/header.component';
import { WarTrackFormComponent } from '../war-track-form/war-track-form.component';
import { FirebaseService } from '../../service/firebase.service';
import { Player } from '../../models/team';
import { User } from '../../models/user';
import { NgFor, NgIf } from '@angular/common';
import { WarTrackItemComponent } from '../war-track-item/war-track-item.component';
import { DatabaseService } from '../../service/database.service';
import { WarEntity } from '../../db';
import { WarStatsComponent } from '../war-stats/war-stats.component';
import { liveQuery } from 'dexie';

@Component({
  selector: 'app-player-profile',
  standalone: true,
  imports: [HeaderComponent, WarStatsComponent, NgIf],
  templateUrl: './player-profile.component.html',
  styleUrl: './player-profile.component.scss',
})
export class PlayerProfileComponent implements OnInit {
  @Output() id: string | null = '';
  player?: Player;
  wars!: War[];
  local: LocalService = inject(LocalService);
  database: DatabaseService = inject(DatabaseService);
  firebase: FirebaseService = inject(FirebaseService);

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.id = params.get('id');
      let player = this.local
        .getPlayers()
        .flatMap((value) => value.players)
        .find((player) => player.player_id.toString() == this.id);
      this.player = player;
    });
    this.database.getWars().subscribe((wars) => {
      this.wars = wars.map((war) => War.fromEntity(war)).filter(war => war.hasPlayer(this.id ?? ''));
    });
  }
}
