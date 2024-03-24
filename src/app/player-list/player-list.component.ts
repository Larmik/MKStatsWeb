import { NgFor } from '@angular/common';
import { Component, Input } from '@angular/core';
import { PlayerItemComponent } from '../player-item/player-item.component';
import { Player } from '../../models/team';

@Component({
  selector: 'app-player-list',
  standalone: true,
  imports: [NgFor, PlayerItemComponent],
  templateUrl: './player-list.component.html',
  styleUrl: './player-list.component.scss',
})
export class PlayerListComponent {
  @Input() players!: Player[];
}
