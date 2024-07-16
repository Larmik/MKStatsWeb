import { Component, Input, OnChanges } from '@angular/core';
import { Team } from '../../models/team';
import { TeamStats } from '../../models/stats';

@Component({
  selector: 'app-opponent-item',
  standalone: true,
  imports: [],
  templateUrl: './opponent-item.component.html',
  styleUrl: './opponent-item.component.scss'
})
export class OpponentItemComponent implements OnChanges {
  @Input() team?: Team
  @Input() teamStats?: TeamStats
  @Input() label: string = "jouées"
  logo?: string
  

  ngOnChanges(): void {
    if (this.team) {
      this.logo = 'https://www.mariokartcentral.com/mkc/storage/' + this.team.team_logo
    } else if (this.teamStats) {
      this.logo = 'https://www.mariokartcentral.com/mkc/storage/' + this.teamStats.team?.team_logo
    }
  }
}
