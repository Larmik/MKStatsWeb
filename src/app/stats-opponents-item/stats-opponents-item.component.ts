import { Component, Input } from '@angular/core';
import { Stats } from '../../models/stats';

@Component({
  selector: 'app-stats-opponents-item',
  standalone: true,
  imports: [],
  templateUrl: './stats-opponents-item.component.html',
  styleUrl: './stats-opponents-item.component.scss'
})
export class StatsOpponentsItemComponent {
  @Input() stats!: Stats

}
