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

  ngOnChanges(changes: SimpleChanges): void {
    this.warsPlayed = this.stats.length;
    this.warsWon = this.stats.filter((war: any) =>
      war.displayedDiff.includes('+')
    ).length;
    this.warsTied = this.stats.filter(
      (war: any) => war.displayedDiff == '0'
    ).length;
    this.warsLoss = this.stats.filter((war: any) =>
      war.displayedDiff.includes('-')
    ).length;
  }
}
