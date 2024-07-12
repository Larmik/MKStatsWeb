import { Component, Input, OnInit, inject } from '@angular/core';
import { Player, Team } from '../../models/team';
import { LocalService } from '../../service/local.service';
import { MKCentralService } from '../../service/mkcentral.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-player-infos',
  standalone: true,
  imports: [NgIf],
  templateUrl: './player-infos.component.html',
  styleUrl: './player-infos.component.scss'
})
export class PlayerInfosComponent implements OnInit {
  @Input() player! : Player
  role! : string
  fullPlayer!: any
  local: LocalService = inject(LocalService)
  mkCentral: MKCentralService = inject(MKCentralService)

  ngOnInit(): void {
    let user = this.local.getUsers().find(user => user.mkcId == this.player.player_id.toString())
    this.mkCentral.getPlayerById(this.player.player_id.toString()).subscribe((fullPlayer: any) => {
      this.fullPlayer = fullPlayer
    })
    if (user) {
      switch (user.role) {
        case 1: {
          this.role = "Admin";
          break;
        }
        case 2: {
          this.role = "Leader";
          break;
        }
        default: {
          this.role = "Membre";
          break;
        }
  
      }
    }
  }

}
