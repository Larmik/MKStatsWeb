import { Component, Input } from '@angular/core';
import { War, WarTrack } from '../../models/war';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-score-item',
  standalone: true,
  imports: [NgIf],
  templateUrl: './score-item.component.html',
  styleUrl: './score-item.component.scss',
})
export class ScoreItemComponent {
  @Input() war?: War;
  @Input() track?: WarTrack;
}
