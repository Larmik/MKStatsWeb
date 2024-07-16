import { Component, Input, OnChanges, OnInit, inject } from '@angular/core';
import { Stats } from '../../models/stats';
import { LocalService } from '../../service/local.service';
import { WarItemComponent } from "../war-item/war-item.component";
import { DatabaseService } from '../../service/database.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-stats-records-item',
  standalone: true,
  imports: [WarItemComponent, NgIf],
  templateUrl: './stats-records-item.component.html',
  styleUrl: './stats-records-item.component.scss'
})
export class StatsRecordsItemComponent implements OnChanges {
  @Input() stats!: Stats
  mkcentral: DatabaseService = inject(DatabaseService)
  local: LocalService = inject(LocalService)

  victoryLabel!: string
  defeatLabel!: string
  highestScoreWar!: string
  lowestScoreWar!: string

  ngOnChanges(): void {
    if (this.stats) {
      this.mkcentral.getTeam(this.stats.warStats.highestVicory.teamOpponent).subscribe(victoryOp => {
        this.mkcentral.getTeam(this.stats.warStats.loudestDefeat.teamOpponent).subscribe(defeatOp => {
          console.log(victoryOp)
          let team = this.local.getTeam()?.team_name
          if (team) {
            this.victoryLabel = team + " - " + victoryOp?.team_name
            this.defeatLabel = team + " - " + defeatOp?.team_name
          }
        })
      })  

      this.mkcentral.getTeam(this.stats.highestPlayerScore?.second?.teamOpponent ?? '').subscribe(team => {
        this.highestScoreWar = "vs " + team?.team_name
      })

      this.mkcentral.getTeam(this.stats.lowestPlayerScore?.second?.teamOpponent ?? '').subscribe(team => {
        this.lowestScoreWar = "vs " + team?.team_name
      })
    }
  }
}