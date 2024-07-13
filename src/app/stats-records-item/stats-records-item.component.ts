import { Component, Input, OnChanges, OnInit, inject } from '@angular/core';
import { Stats } from '../../models/stats';
import { MKCentralService } from '../../service/mkcentral.service';
import { LocalService } from '../../service/local.service';

@Component({
  selector: 'app-stats-records-item',
  standalone: true,
  imports: [],
  templateUrl: './stats-records-item.component.html',
  styleUrl: './stats-records-item.component.scss'
})
export class StatsRecordsItemComponent implements OnChanges {
  @Input() stats!: Stats
  mkcentral: MKCentralService = inject(MKCentralService)
  local: LocalService = inject(LocalService)

  victoryLabel!: string
  defeatLabel!: string

  ngOnChanges(): void {
    this.mkcentral.getTeamById(this.stats.warStats.highestVicory.teamOpponent).subscribe(victoryOp => {
      this.mkcentral.getTeamById(this.stats.warStats.loudestDefeat.teamOpponent).subscribe(defeatOp => {
        console.log(victoryOp)
        let team = this.local.getTeam()?.team_name
        this.victoryLabel = team + " - " + victoryOp.team_name
        this.defeatLabel = team + " - " + defeatOp.team_name
      })
    })  
  }
}