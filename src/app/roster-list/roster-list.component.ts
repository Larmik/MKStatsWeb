import { Component, Input, inject } from '@angular/core';
import { Player, Roster } from '../../models/team';
import { NgFor } from '@angular/common';
import { PlayerItemComponent } from '../player-item/player-item.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-roster-list',
  standalone: true,
  imports: [NgFor, PlayerItemComponent],
  templateUrl: './roster-list.component.html',
  styleUrl: './roster-list.component.scss'
})
export class RosterListComponent {
  @Input() roster!: Roster;
  router: Router = inject(Router);

  onPlayerClick(player: Player) {
    this.router.navigate(['/player/' + player.player_id.toString()]);
  }

  
}
