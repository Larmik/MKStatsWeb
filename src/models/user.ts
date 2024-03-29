import { DataSnapshot } from '@angular/fire/database';
import { Player } from './team';
import { UserCredential } from '@angular/fire/auth';

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

  public static create(user: UserCredential): User {
    let instance = new User()
    let fbUser = user.user
    instance.mid = user.user.uid
    instance.currentWar = "-1";
    instance.name = fbUser.displayName ?? ""
    instance.role = 0;
    return instance
  }

  public static addPlayerInfo(user: User, player: any): User {
    user.mkcId = player.id
    user.name = player.display_name
    user.picture = player.profile_picture
    return user
  }
}
