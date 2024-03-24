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
}
