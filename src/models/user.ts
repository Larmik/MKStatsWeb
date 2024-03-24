import { DataSnapshot } from '@angular/fire/database';
import { Player } from './team';

export class User {
  mid?: string;
  mkcId?: string;
  discordId?: string;
  currentWar?: string;
  role?: number;
  name?: string;
  picture?: string;

  constructor() {}

  public static fromDatasnapshot(snapshot: DataSnapshot): User {
    let instance = new User();
    let user = snapshot.val();
    instance.mid = user.mid;
    instance.mkcId = user.mkcId;
    instance.discordId = user.discordId;
    instance.currentWar = user.currentWar;
    instance.role = user.role;
    instance.name = user.name;
    instance.picture = user.picture;
    return instance;
  }

  public static fromPlayer(player: Player): User {
    let instance = new User();
    instance.mid = player.player_id.toString();
    instance.mkcId = player.player_id.toString();
    instance.name = player.display_name;
    return instance;
  }
}
