import { Component, OnInit, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  user,
} from '@angular/fire/auth';
import { FirebaseService } from '../../service/firebase.service';
import { User } from '../../models/user';
import { LocalService } from '../../service/local.service';
import { MKCentralService } from '../../service/mkcentral.service';
import { Player, Roster, Team } from '../../models/team';
import { FirebaseError } from '@angular/fire/app';
import { NgIf } from '@angular/common';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { LinkMkcComponent } from '../link-mkc/link-mkc.component';

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
    NgIf,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  private auth: Auth = inject(Auth);
  private firebase: FirebaseService = inject(FirebaseService);
  private local: LocalService = inject(LocalService);
  private service: MKCentralService = inject(MKCentralService);
  private router: Router = inject(Router);
  error?: string;

  signup: Boolean = false;
  private userToWrite?: User

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {
    let user = this.local.getCurrentUser()
    let team = this.local.getTeam()
    if (user && team) this.router.navigate(['/home'])
  }


  submit() {
    let email = (<HTMLInputElement>document.getElementById('email')).value;
    let password = (<HTMLInputElement>document.getElementById('password'))
      .value;
  
    if (this.signup) {
      let confirmPassword = (<HTMLInputElement>(
        document.getElementById('passwordConfirm')
      )).value;
      if (password == confirmPassword)
       createUserWithEmailAndPassword(this.auth, email, password)
        .then((userCredential) => { 
          this.userToWrite = User.create(userCredential) 
          this.local.saveCurrentUser(this.userToWrite)
          this.firebase.writeUser(this.userToWrite)
        })
        .then((_ : void) => { this.showLinkMKCDialog() });
        else this.error = "Les mots de passe ne correspondent pas."
    }
     
    else
      signInWithEmailAndPassword(this.auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          this.firebase.getUsers().subscribe((users: User[]) => {
            this.local.saveUsers(users);
            let current = users.find(
              (element: User) => element.mid == user.uid
            );
            if (current) {
              this.local.saveCurrentUser(current);
              console.log(current.mkcId)

              this.service.getPlayerById(current.mkcId ?? '').subscribe(
                (player: any) => {
                  let players: Roster[] = []
                  if (player)
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
                                  if (players.length == length) {
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
                      });
                },
                (error) => {
                  switch (error.status) {
                    case 404: {
                      this.error =
                        "L'utilisateur est inscrit mais n'a aucun compte MKC associé. Rapprochez-vous d'un admin via Discord pour jumeler un compte MKC.";
                      break;
                    }
                    default: {
                      this.error = 'Une erreur est survenue';
                      break;
                    }
                  }
                }
              );
            }
          });
        })
        .catch((err: FirebaseError) => {
          switch (err.message.split('/')[1].replace(').', '')) {
            case 'invalid-email': {
              this.error = 'Veuillez saisir une adresse email valide.';
              break;
            }
            case 'wrong-password': {
              this.error = 'Le mot de passe est incorrect.';
              break;
            }
            case 'user-not-found': {
              this.error =
                "Cette adresse email n'est associée à aucun compte. Inscrivez-vous et réessayez.";
              break;
            }
            default: {
              break;
            }
          }
        });
  }

  onSignupEnabled(signup: Boolean) {
    this.signup = signup;
  }

  showLinkMKCDialog() {
    let config = new MatDialogConfig();
    config.maxWidth = '90%'
    this.dialog.open(LinkMkcComponent, config);
  }
  getAlliesAndRedirect() {
    let allies: Player[] = new Array(0);
  this.firebase
  .getAllies()
  .subscribe((alliesStr: string[]) => {
    if (!alliesStr || alliesStr.length == 0)
      this.router.navigate(['/home']);
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
 }}
