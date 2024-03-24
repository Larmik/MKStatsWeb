import { Component, Input, OnInit, inject } from '@angular/core';
import { MKCentralService } from '../../service/mkcentral.service';
import { Player } from '../../models/team';
import { LocalService } from '../../service/local.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-player-item',
  standalone: true,
  imports: [],
  templateUrl: './player-item.component.html',
  styleUrl: './player-item.component.scss',
})
export class PlayerItemComponent implements OnInit {
  @Input() player!: Player;
  @Input() user?: User;
  imageUrl?: string;
  service: MKCentralService = inject(MKCentralService);
  local: LocalService = inject(LocalService);

  ngOnInit(): void {
    let user =
      this.user ??
      this.local
        .getUsers()
        .find((user: User) => user.mkcId == this.player.player_id.toString());
    if (user) this.imageUrl = user.picture;
    else
      this.service
        .getPlayerById(this.player.player_id.toString())
        .subscribe((user: any) => {
          this.imageUrl = user.profile_picture;
        });
  }
}
