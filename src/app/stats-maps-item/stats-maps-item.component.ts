import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Stats } from '../../models/stats';
import { TrackItemComponent } from '../track-item/track-item.component';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-stats-maps-item',
  standalone: true,
  imports: [TrackItemComponent, NgFor],
  templateUrl: './stats-maps-item.component.html',
  styleUrl: './stats-maps-item.component.scss'
})
export class StatsMapsItemComponent {
  @Input() stats!: Stats
}
