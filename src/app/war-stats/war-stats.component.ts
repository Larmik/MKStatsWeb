import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { War } from '../../models/war';

@Component({
  selector: 'app-war-stats',
  standalone: true,
  imports: [],
  templateUrl: './war-stats.component.html',
  styleUrl: './war-stats.component.scss',
})
export class WarStatsComponent implements OnChanges {
  @Input() stats!: War[];
  warsPlayed!: number;
  warsWon!: number;
  warsTied!: number;
  warsLoss!: number;
  winrate!: number;

  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.stats)
    this.warsPlayed = this.stats.length;
    this.warsWon = this.stats.filter((war: War) =>
      war.displayedDiff?.includes('+')
    ).length;
    this.warsTied = this.stats.filter(
      (war: War) => war.displayedDiff == '0'
    ).length;
    this.warsLoss = this.stats.filter((war: War) =>
      war.displayedDiff?.includes('-')
    ).length;
    if (this.warsPlayed > 0)
      this.winrate = Math.round((this.warsWon*100)/this.warsPlayed)
    else
    this.winrate = 0
  }
}
