import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { FirebaseService } from '../../service/firebase.service';
import { User } from '../../models/user';
import { LocalService } from '../../service/local.service';
import { MKCentralService } from '../../service/mkcentral.service';
import { Player, Team } from '../../models/team';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatCardModule,
    MatFormFieldModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatButtonModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private auth: Auth = inject(Auth);
  private firebase: FirebaseService = inject(FirebaseService);
  private local: LocalService = inject(LocalService);
  private service: MKCentralService = inject(MKCentralService);
  private router: Router = inject(Router);

  submit() {
    let email = (<HTMLInputElement>document.getElementById('email')).value;
    let password = (<HTMLInputElement>document.getElementById('password'))
      .value;
    signInWithEmailAndPassword(this.auth, email, password).then(
      (userCredential) => {
        const user = userCredential.user;
        let allies: Player[] = new Array(0);
        this.firebase.getUsers().subscribe((users: User[]) => {
          this.local.saveUsers(users);
          let current = users.find((element: User) => element.mid == user.uid);
          if (current) {
            this.local.saveCurrentUser(current);
            this.service
              .getPlayerById(current.mkcId ?? '')
              .subscribe((player: any) => {
                this.service
                  .getTeamById(player.current_teams[0].team_id.toString())
                  .subscribe((team: any) => {
                    let newTeam = new Team(team);
                    this.local.saveTeam(newTeam);
                    this.local.savePlayers(newTeam.roster);
                    this.firebase
                      .getAllies()
                      .subscribe((alliesStr: string[]) => {
                        alliesStr.forEach((ally: string) => {
                          this.service
                            .getPlayerById(ally)
                            .subscribe((player: Player) => {
                              allies.push(new Player(player, true));
                              if (allies.length == alliesStr.length) {
                                this.local.saveAllies(allies);
                                this.router.navigate(['/home']);
                              }
                            });
                        });
                      });
                  });
              });
          }
        });
      }
    );
  }
}
