import { Component, OnInit, inject } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { TeamItemComponent } from '../team-item/team-item.component';
import { LocalService } from '../../service/local.service';
import { MKCentralService } from '../../service/mkcentral.service';
import { MatButtonModule } from '@angular/material/button';
import { NgClass } from '@angular/common';
import { War, WarPenalty } from '../../models/war';
import { FirebaseService } from '../../service/firebase.service';

@Component({
  selector: 'app-add-penalty',
  standalone: true,
  imports: [MatDialogModule, TeamItemComponent, MatButtonModule, NgClass],
  templateUrl: './add-penalty.component.html',
  styleUrl: './add-penalty.component.scss',
})
export class AddPenaltyComponent implements OnInit {
  teamHost!: any;
  teamOpponent: any;
  local: LocalService = inject(LocalService);
  service: MKCentralService = inject(MKCentralService);
  firebase: FirebaseService = inject(FirebaseService);

  selectedTeam: any;

  ngOnInit(): void {
    let currentWar = this.local.getCurrentWar();
    if (currentWar) {
      this.teamHost = this.local.getTeam();
      this.service
        .getTeamById(currentWar.teamOpponent)
        .subscribe((team: any) => {
          this.teamOpponent = team;
        });
    }
  }

  onTeamSelected(team: any) {
    this.selectedTeam = team;
  }

  onPenaltyAdded() {
    let current = this.local.getCurrentWar();
    if (current) {
      let amount = (<HTMLInputElement>document.getElementById('penaltyAmount'))
        .value;
      let penalty = WarPenalty.create(this.selectedTeam.id, +amount);
      current = War.addPenalty(current, penalty);
      this.firebase.writeCurrentWar(current);
      this.local.saveCurrentWar(current);
      setTimeout(function () {
        window.location.reload();
      }, 100);
    }
  }
}
