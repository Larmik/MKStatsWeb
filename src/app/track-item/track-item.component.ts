import { Component, Input } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-track-item',
  standalone: true,
  imports: [MatDialogModule],
  templateUrl: './track-item.component.html',
  styleUrl: './track-item.component.scss',
})
export class TrackItemComponent {
  @Input() map!: any;
  @Input() disabled !: Boolean;

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
