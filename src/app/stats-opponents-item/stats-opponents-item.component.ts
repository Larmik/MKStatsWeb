import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Stats } from '../../models/stats';
import { NgFor } from '@angular/common';
import { OpponentItemComponent } from '../opponent-item/opponent-item.component';

@Component({
  selector: 'app-stats-opponents-item',
  standalone: true,
  imports: [NgFor, OpponentItemComponent],
  templateUrl: './stats-opponents-item.component.html',
  styleUrl: './stats-opponents-item.component.scss'
})
export class StatsOpponentsItemComponent  {
  @Input() stats!: Stats
}
