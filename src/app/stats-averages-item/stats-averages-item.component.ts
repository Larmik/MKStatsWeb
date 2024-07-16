import { Component, Input, OnInit } from '@angular/core';
import { Stats } from '../../models/stats';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-stats-averages-item',
  standalone: true,
  imports: [NgIf],
  templateUrl: './stats-averages-item.component.html',
  styleUrl: './stats-averages-item.component.scss'
})
export class StatsAveragesItemComponent  {
  @Input() stats!: Stats
}
