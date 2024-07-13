import { Component, Input } from '@angular/core';
import { Stats } from '../../models/stats';

@Component({
  selector: 'app-stats-maps-item',
  standalone: true,
  imports: [],
  templateUrl: './stats-maps-item.component.html',
  styleUrl: './stats-maps-item.component.scss'
})
export class StatsMapsItemComponent {
  @Input() stats!: Stats

}
