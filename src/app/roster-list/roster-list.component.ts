import { Component, Input } from '@angular/core';
import { Roster } from '../../models/team';
import { NgFor } from '@angular/common';
import { PlayerItemComponent } from '../player-item/player-item.component';

@Component({
  selector: 'app-roster-list',
  standalone: true,
  imports: [NgFor, PlayerItemComponent],
  templateUrl: './roster-list.component.html',
  styleUrl: './roster-list.component.scss'
})
export class RosterListComponent {
  @Input() roster!: Roster;
}
