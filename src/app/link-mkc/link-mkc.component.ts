import { Component, inject } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { LocalService } from '../../service/local.service';
import { MKCentralService } from '../../service/mkcentral.service';
import { MatButtonModule } from '@angular/material/button';
import { FirebaseService } from '../../service/firebase.service';
import { User } from '../../models/user';
import { Player, Team } from '../../models/team';
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
    if (mkcId && fbUser) {
      this.service.getPlayerById(mkcId).subscribe(
        (player: any) => {
          console.log(player);
          let allies: Player[] = new Array(0);
          let user = User.addPlayerInfo(fbUser!, player);
          console.log(user);
          this.local.saveCurrentUser(user);
          this.firebase.writeUser(user);
          if (player.current_teams[0])
            this.service
              .getTeamById(player.current_teams[0].team_id.toString())
              .subscribe(
                (team: any) => {
                  let newTeam = new Team(team);
                  this.local.saveTeam(newTeam);
                  this.local.savePlayers(newTeam.roster);
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
                },
                (error) =>
                  (this.error = "Le joueur ne fait partie d'aucune équipe.")
              );
          else this.error = "Le joueur ne fait partie d'aucune équipe.";
        },
        (error) => (this.error = "Le joueur n'a pas été trouvé.")
      );
    } else this.error = "Le joueur n'a pas été trouvé.";
  }
}
