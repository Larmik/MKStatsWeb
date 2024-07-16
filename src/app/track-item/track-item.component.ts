import { Component, Input, OnInit } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { TrackStats } from '../../models/stats';
import { NgIf } from '@angular/common';
import { NumberUtils } from '../../utils/number.utils';

@Component({
  selector: 'app-track-item',
  standalone: true,
  imports: [MatDialogModule, NgIf],
  templateUrl: './track-item.component.html',
  styleUrl: './track-item.component.scss',
})
export class TrackItemComponent implements OnInit {
  @Input() map!: any;
  @Input() disabled !: Boolean;
  @Input() trackStats? : TrackStats
  averagePos?: number
  
  ngOnInit(): void {
    this.averagePos = NumberUtils.pointsToPosition(Math.round(this.trackStats?.playerScore  ?? 0))
  }
  

  onMouseEnter(hoverName: HTMLElement) {
    if (!this.disabled) {
      hoverName.style.backgroundColor = "#051c3d";
      hoverName.style.color = "white";
      hoverName.style.cursor = "pointer";
    }
  
  }

  onMouseOut(hoverName: HTMLElement) {
    if (!this.disabled) {
      hoverName.style.backgroundColor = "#ffffffaa";
      hoverName.style.color = "black";
      hoverName.style.cursor = "unset"; 
    } 
  }

}
