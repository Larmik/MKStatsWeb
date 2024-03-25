import {
  Component,
  Input,
  OnInit,
  inject,
} from '@angular/core';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { LocalService } from '../../service/local.service';
import { War } from '../../models/war';
import { WarItemComponent } from '../war-item/war-item.component';
import { Player } from '../../models/team';
import { PlayersScoresComponent } from '../players-scores/players-scores.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SubPlayerComponent } from '../sub-player/sub-player.component';
import { AddPenaltyComponent } from '../add-penalty/add-penalty.component';
import { MKCentralService } from '../../service/mkcentral.service';
import { FirebaseService } from '../../service/firebase.service';
import { AuthService } from '../../service/auth.service';
import { EditTabComponent } from '../edit-tab/edit-tab.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    NgIf,
    MatButtonModule,
    WarItemComponent,
    PlayersScoresComponent,
    SubPlayerComponent,
    AddPenaltyComponent,
    NgFor,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  @Input() team!: any;
  @Input() war!: War;
  @Input() players!: Player[];
  profilePicture?: string;
  profileName?: string;
  teamPicture!: string;
  local: LocalService = inject(LocalService);
  service: MKCentralService = inject(MKCentralService);
  firebase: FirebaseService = inject(FirebaseService);
  auth: AuthService = inject(AuthService);
  router: Router = inject(Router);
  penalties!: Map<string, number>;

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {
    let penas: Map<string, number> = new Map();
    let current = this.local.getCurrentUser();
    let team = this.local.getTeam();
    this.profileName = current?.name;
    this.profilePicture = current?.picture;
    this.teamPicture =
      'https://www.mariokartcentral.com/mkc/storage/' + team?.team_logo;
    if (this.war) {
      this.war.penalties.forEach((pena) => {
        if (team?.team_name && pena?.amount) {
          if (pena.teamId == team?.id.toString()) {
            penas.set(team?.team_name, pena.amount);
          } else if (pena.teamId) {
            this.service.getTeamById(pena.teamId).subscribe((team) => {
              if (pena.amount) penas.set(team.team_name, pena.amount);
            });
          }
        }
      });
    }

    this.penalties = penas;
  }

  cancelWar() {
    this.local.clearCurrentWar();
    this.local.clearCurrentTrack();
    let players = this.local.getCurrentPlayers();
    players.forEach((player) => {
      player.currentWar = '-1';
      this.firebase.writeUser(player);
    });
    this.local.clearCurrentPlayers();
    this.firebase.deleteCurrentWar();
    this.router.navigate(['/home']);
  }

  openSubDialog() {
    let config = new MatDialogConfig();
    config.minWidth = '50%';
    this.dialog.open(SubPlayerComponent, config);
  }

  openPenaDialog() {
    let config = new MatDialogConfig();
    config.minWidth = '40%';
    this.dialog.open(AddPenaltyComponent, config);
  }

  openTabDialog() {
    let config = new MatDialogConfig();
    config.minWidth = '40%';
    config.data = this.players
    this.dialog.open(EditTabComponent, config);
  }

  logout() {
    this.auth.logout();
    this.local.clearAll();
    this.router.navigate(['']);
  }

  validateWar() {
    let current = this.local.getCurrentWar();
    if (current) {
      this.firebase.writeWar(current);
      let players = this.local.getCurrentPlayers();
      players.forEach((player) => {
        player.currentWar = '-1';
        this.firebase.writeUser(player);
      });
      this.firebase.deleteCurrentWar();
      this.local.clearCurrentPlayers();
      this.local.clearCurrentWar();
      this.local.clearCurrentTrack();
      this.firebase.getUsers().subscribe((users) => {
        this.local.saveUsers(users);
      });
      setTimeout(() => {
        this.router.navigate(['/home']);
      }, 100);
    }
  }
}
