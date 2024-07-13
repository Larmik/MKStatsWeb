import { Component, Input, OnInit, inject } from '@angular/core';
import { War } from '../../models/war';
import { MKCentralService } from '../../service/mkcentral.service';
import { LocalService } from '../../service/local.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-war-item',
  standalone: true,
  imports: [NgIf],
  templateUrl: './war-item.component.html',
  styleUrl: './war-item.component.scss',
})
export class WarItemComponent implements OnInit {
  @Input() war!: War;
  teamHostName?: string;
  teamHostUrl!: string;
  teamOpponentName!: string;
  teamOpponentUrl!: string;
  service: MKCentralService = inject(MKCentralService);
  local: LocalService = inject(LocalService);

  ngOnInit(): void {
    this.service.getTeamById(this.war.teamOpponent).subscribe((team: any) => {
      this.teamOpponentName = team.team_name;
      this.teamOpponentUrl =
        'https://www.mariokartcentral.com/mkc/storage/' + team.team_logo;
    });
    this.service.getTeamById(this.war.teamHost).subscribe((team: any) => {
      this.teamHostName = team.team_name;
      this.teamHostUrl =
        'https://www.mariokartcentral.com/mkc/storage/' + team.team_logo;
    });
  }
}
