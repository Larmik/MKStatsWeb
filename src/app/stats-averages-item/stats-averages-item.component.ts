import { Component, Input } from '@angular/core';
import { Stats } from '../../models/stats';

@Component({
  selector: 'app-stats-averages-item',
  standalone: true,
  imports: [],
  templateUrl: './stats-averages-item.component.html',
  styleUrl: './stats-averages-item.component.scss'
})
export class StatsAveragesItemComponent {
  @Input() stats!: Stats

}
