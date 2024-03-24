import { Component, inject } from '@angular/core';
import { MKCentralService } from '../../service/mkcentral.service';
import { TeamItemComponent } from '../team-item/team-item.component';
import { NgFor, NgIf } from '@angular/common';
import { SelectPlayerComponent } from '../select-player/select-player.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-create-war',
  standalone: true,
  imports: [
    TeamItemComponent,
    NgFor,
    NgIf,
    SelectPlayerComponent,
    MatButtonModule,
  ],
  templateUrl: './create-war.component.html',
  styleUrl: './create-war.component.scss',
})
export class CreateWarComponent {
  service: MKCentralService = inject(MKCentralService);
  teams!: any[];
  selectedTeam?: any;
  selectedTeamPicture?: string;

  constructor(public dialog: MatDialog) {}

  submit() {
    let query = (<HTMLInputElement>document.getElementById('searchTeam')).value;
    if (query.length >= 3) {
      this.service.searchTeam(query).subscribe((team: any) => {
        this.teams = team['data'];
      });
    }
  }

  onTeamSelected(team: any) {
    this.teams = [];
    this.selectedTeam = team;
    this.service.getTeamById(team.team_id).subscribe((team: any) => {
      this.selectedTeamPicture =
        'https://www.mariokartcentral.com/mkc/storage/' + team.team_logo;
    });
  }

  openDialog(teamId: string) {
    let config = new MatDialogConfig();
    config.minWidth = '75%';
    config.data = teamId;
    this.dialog.open(SelectPlayerComponent, config);
  }

  cancel() {
    this.selectedTeam = null;
    this.selectedTeamPicture = undefined;
  }
}
