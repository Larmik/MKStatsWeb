import { Component, inject } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { LocalService } from '../../service/local.service';
import { MKCentralService } from '../../service/mkcentral.service';
import { MatButtonModule } from '@angular/material/button';
import { FirebaseService } from '../../service/firebase.service';
import { User } from '../../models/user';
import { Player, Roster, Team } from '../../models/team';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-link-mkc',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, NgIf],
  templateUrl: './link-mkc.component.html',
  styleUrl: './link-mkc.component.scss',
})
export class LinkMkcComponent {
  local: LocalService = inject(LocalService);
  service: MKCentralService = inject(MKCentralService);
  firebase: FirebaseService = inject(FirebaseService);
  error?: string;
  private router: Router = inject(Router);

  constructor(private dialogRef: MatDialog) {}

  linkMKC() {
    let mkcId = (<HTMLInputElement>document.getElementById('mkcId')).value;
    let fbUser = this.local.getCurrentUser();
    if (mkcId) {
      this.service.getPlayerById(mkcId).subscribe(
        (player: any) => {
          let players: Roster[] = []
          if (player && fbUser) {
            let playerToWrite = User.addPlayerInfo(fbUser, player)
            this.firebase.writeUser(playerToWrite)
            this.local.saveCurrentUser(playerToWrite)
            this.service
            .getTeamById(player.current_teams[0].team_id.toString())
            .subscribe((team: any) => {
              let newTeam = new Team(team)
              this.local.saveTeam(newTeam);
              if (newTeam.primary_team_id) {
                this.service.getTeamById(newTeam.primary_team_id.toString())
                .subscribe(team => {
                  let mainTeam = new Team(team)
                  players.push(new Roster(mainTeam, mainTeam.roster))
                  if (team.secondary_teams) {
                    let length = team.secondary_teams.length
                    team.secondary_teams.forEach((team: any) => {
                      this.service.getTeamById(team.id.toString())
                      .subscribe((team: any) => {
                        console.log(team)
                        let teamToAdd = new Team(team)
                        if (newTeam.id != teamToAdd.id)
                          players.push(new Roster(teamToAdd, teamToAdd.roster))
                        console.log("players length : " + players.length + " length " + length)
                        if (players.length == length && fbUser) {
                            players.push(new Roster(newTeam, newTeam.roster))
                            this.local.savePlayers(players)
                            this.getAlliesAndRedirect()
                        }
                      })
                    })
                  }
                })
              } else if (team.secondary_teams) {
                console.log("secondary")
                let length = team.secondary_teams.length
                team.secondary_teams.forEach((team: any) => {
                  this.service.getTeamById(team.id.toString())
                  .subscribe((team: any) => {
                    let teamToAdd = new Team(team)
                    if (newTeam.id != teamToAdd.id)
                      players.push(new Roster(teamToAdd, teamToAdd.roster))
                    if (players.length == length) {
                        players.push(new Roster(newTeam, newTeam.roster))
                        this.local.savePlayers(players)
                        this.getAlliesAndRedirect()
                    }
                  })
                })
              } else {
                players.push(new Roster(newTeam, newTeam.roster))
                this.local.savePlayers(players);
                this.getAlliesAndRedirect()
              }
            }, (error => this.error = "Le joueur ne fait partie d'aucune équipe."));
          } else this.error = "Le joueur ne fait partie d'aucune équipe."
          
        },
        (error) => (this.error = "Le joueur n'a pas été trouvé.")
      );
    } else this.error = "Le joueur n'a pas été trouvé.";
  }

getAlliesAndRedirect () {
  let allies: Player[] = new Array(0);
  this.firebase.getAllies().subscribe((alliesStr: string[]) => {
    if (!alliesStr || alliesStr.length == 0)
      this.router.navigate(['/home']);
    alliesStr.forEach((ally: string) => {
      this.service
        .getPlayerById(ally)
        .subscribe((player: Player) => {
          allies.push(new Player(player, true));
          if (allies.length == alliesStr.length) {
            this.local.saveAllies(allies);
            this.dialogRef.closeAll();
            this.router.navigate(['/home']);
          }
        });
    });
  });
}
}

