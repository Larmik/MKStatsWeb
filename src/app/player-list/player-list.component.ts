import { NgFor } from '@angular/common';
import { Component, Input } from '@angular/core';
import { PlayerItemComponent } from '../player-item/player-item.component';
import { Player, Roster } from '../../models/team';
import { RosterListComponent } from '../roster-list/roster-list.component';

@Component({
  selector: 'app-player-list',
  standalone: true,
  imports: [NgFor, RosterListComponent],
  templateUrl: './player-list.component.html',
  styleUrl: './player-list.component.scss',
})
export class PlayerListComponent {
  @Input() rosters!: Roster[];
}
