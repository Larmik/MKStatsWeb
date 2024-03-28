import { Component, Inject, OnInit, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { TrackItemComponent } from '../track-item/track-item.component';
import { Maps } from '../../models/maps';
import { NgFor } from '@angular/common';
import { LocalService } from '../../service/local.service';
import { WarTrack } from '../../models/war';

@Component({
  selector: 'app-select-track',
  standalone: true,
  imports: [MatDialogModule, TrackItemComponent, NgFor],
  templateUrl: './select-track.component.html',
  styleUrl: './select-track.component.scss',
})
export class SelectTrackComponent implements OnInit {
  maps!: any[];
  local: LocalService = inject(LocalService);

  constructor(@Inject(MAT_DIALOG_DATA) public data: number) {}

  ngOnInit(): void {
    this.maps = [...Maps.values()];
  }

  onTrackSelected(track: any, index: number) {
    let currentWar = this.local.getCurrentWar();
    if (currentWar) {
      if (index - 1 == currentWar?.warTracks.length) {
        //Not editing, use currentWarTrack
        this.local.saveCurrentWarTrack(WarTrack.create(track.index));
      } else {
        //editing, user currentWar.warTracks[warTrackIndex-1]
        currentWar.warTracks[index - 1].trackIndex = track.index;
        this.local.saveCurrentWar(currentWar);
      }
    }
  }

  onSearch() {
    let value = (<HTMLInputElement> document.getElementById("search")).value
    if (value && value.length > 0) 
      this.maps = [...Maps.values()].filter((map: any) => map.name.toLowerCase().includes(value.toLowerCase()) || map.abreviation.toLowerCase().includes(value.toLowerCase()))
     else 
      this.maps = [...Maps.values()]
    
  }
}
