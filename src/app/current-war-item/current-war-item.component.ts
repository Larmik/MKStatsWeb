import { Component, Input, OnInit, inject } from '@angular/core';
import { War } from '../../models/war';
import { MKCentralService } from '../../service/mkcentral.service';
import { LocalService } from '../../service/local.service';
import { Router } from '@angular/router';
import { FirebaseService } from '../../service/firebase.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-current-war-item',
  standalone: true,
  imports: [],
  templateUrl: './current-war-item.component.html',
  styleUrl: './current-war-item.component.scss'
})
export class CurrentWarItemComponent implements OnInit {
  @Input() war!: War;
  teamHostName?: string;
  teamHostUrl!: string;
  teamOpponentName!: string;
  teamOpponentUrl!: string;
  service: MKCentralService = inject(MKCentralService);
  firebase: FirebaseService = inject(FirebaseService);
  local: LocalService = inject(LocalService);
  router: Router = inject(Router)

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

  goToCurrent() {
    let currentPlayers: User[] = [];
    this.firebase.getUsers()
    .subscribe(users => {
      users.filter(user => user.currentWar == this.war.mid).forEach(user => currentPlayers.push(user))
      this.local.saveCurrentWar(this.war)
      this.local.saveCurrentPlayers(currentPlayers);
      this.router.navigate(['/currentWar']);
    })
  
  }
  
}
