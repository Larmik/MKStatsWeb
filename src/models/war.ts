import { DataSnapshot } from '@angular/fire/database';
import { DatePipe } from '@angular/common';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { WarEntity } from '../db';
registerLocaleData(localeFr);

export class War {
  mid: string = '';
  playerHostId: string = '';
  teamHost: string = '';
  teamOpponent: string = '';
  createdDate: string = '';
  isOfficial: boolean = false;
  warTracks: WarTrack[] = [];
  penalties: WarPenalty[] = [];
  scoreHost?: number;
  scoreOpponent?: number;
  displayedDiff?: string;

  public static fromDatasnapshot(snapshot: DataSnapshot): War {
    let instance = new War();
    let war = snapshot.val();
    let tracks: WarTrack[] = new Array();
    let penalties: WarPenalty[] = new Array();

    snapshot.child('warTracks').forEach((warTrack) => {
      let track = WarTrack.fromDatasnapshot(warTrack);
      tracks.push(track);
    });
    snapshot.child('penalties').forEach((warPenalty) => {
      let penalty = WarPenalty.fromDatasnapshot(warPenalty);
      penalties.push(penalty);
    });
    instance.mid = war.mid;
    instance.playerHostId = war.playerHostId;
    instance.teamHost = war.teamHost;
    instance.teamOpponent = war.teamOpponent;
    instance.createdDate = war.createdDate;
    instance.isOfficial = war.isOfficial;
    var finalScoreHost = 0
    if (tracks.length > 0)
      finalScoreHost = tracks
        .map((track) => track.teamScore)
        .reduce((sum, current) => (sum ?? 0) + (current ?? 0)) ?? 0;
    let finalScoreOpponent = 82 * tracks.length - finalScoreHost;
    if (tracks.length > 0) {
      instance.warTracks = tracks;
      if (penalties.length > 0) {
        instance.penalties = penalties;
        penalties.forEach((pena) => {
          if (pena.amount && pena.teamId == war.teamHost)
            finalScoreHost -= pena.amount;
          if (pena.amount && pena.teamId == war.teamOpponent)
            finalScoreOpponent -= pena.amount;
        });
      }
      instance.scoreHost = finalScoreHost;
      instance.scoreOpponent = finalScoreOpponent;
      let diffScore = instance.scoreHost - instance.scoreOpponent;
      instance.displayedDiff =
        diffScore > 0 ? '+' + diffScore.toString() : diffScore.toString();
    } else {
      instance.scoreHost = 0;
      instance.scoreOpponent = 0;
      instance.displayedDiff = '0';
    }
    return instance;
  }

  public static create(
    playerId: string,
    teamHost: string,
    teamOpponent: string
  ): War {
    let instance = new War();
    let date = new Date();
    let pipe = new DatePipe('fr-FR');
    instance.mid = date.getTime().toString();
    instance.teamHost = teamHost;
    instance.teamOpponent = teamOpponent;
    instance.playerHostId = playerId;
    instance.scoreHost = 0;
    instance.scoreOpponent = 0;
    instance.displayedDiff = '0';
    instance.createdDate =
      pipe.transform(date, "dd/MM/yyyy - HH'h'mm")?.toString() ?? '';
    return instance;
  }

  public static addTrack(war: War, track: WarTrack, index: number): War {
    if (index > war.warTracks.length) war.warTracks.push(track);
    else war.warTracks[index - 1] = track;
    let finalScoreHost =
      war.warTracks
        .map((track) => track.teamScore)
        .reduce((sum, current) => (sum ?? 0) + (current ?? 0)) ?? 0;
    let finalScoreOpponent = 82 * war.warTracks.length - finalScoreHost;
    war.penalties.forEach((pena) => {
      if (pena.amount && pena.teamId == war.teamHost)
        finalScoreHost -= pena.amount;
      if (pena.amount && pena.teamId == war.teamOpponent)
        finalScoreOpponent -= pena.amount;
    });

    war.scoreHost = finalScoreHost;
    war.scoreOpponent = finalScoreOpponent;
    let diffScore = war.scoreHost - war.scoreOpponent;
    war.displayedDiff =
      diffScore > 0 ? '+' + diffScore.toString() : diffScore.toString();
    return war;
  }

  public static addPenalty(war: War, penalty: WarPenalty): War {
    let finalScoreHost =
      war.warTracks
        .map((track) => track.teamScore)
        .reduce((sum, current) => (sum ?? 0) + (current ?? 0)) ?? 0;
    let finalScoreOpponent = 82 * war.warTracks.length - finalScoreHost;
    let penas = war.penalties ?? [];
    penas.push(penalty);
    war.penalties = penas;
    penas.forEach((pena) => {
      if (pena.amount && pena.teamId == war.teamHost)
        finalScoreHost -= pena.amount;
      if (pena.amount && pena.teamId == war.teamOpponent)
        finalScoreOpponent -= pena.amount;
    });

    war.scoreHost = finalScoreHost;
    war.scoreOpponent = finalScoreOpponent;
    let diffScore = war.scoreHost - war.scoreOpponent;
    war.displayedDiff =
      diffScore > 0 ? '+' + diffScore.toString() : diffScore.toString();
    return war;
  }

  public static toEntity(war: War): WarEntity {
    let entity = new WarEntity()
    entity.mid = war.mid
    entity.createdDate = war.createdDate
    entity.isOfficial = war.isOfficial
    entity.playerHostId = war.playerHostId
    entity.teamHost = war.teamHost
    entity.teamOpponent = war.teamOpponent
    entity.warTracks = JSON.stringify(war.warTracks)
    entity.penalties = JSON.stringify(war.penalties)
    entity.displayedDiff = war.displayedDiff
    entity.scoreHost = war.scoreHost
    entity.scoreOpponent = war.scoreOpponent
    return entity
  }
  public static fromEntity(war: WarEntity): War {
    let entity = new War()
    entity.mid = war.mid
    entity.createdDate = war.createdDate
    entity.isOfficial = war.isOfficial
    entity.playerHostId = war.playerHostId
    entity.teamHost = war.teamHost
    entity.teamOpponent = war.teamOpponent
    entity.warTracks = JSON.parse(war.warTracks)
    entity.penalties = JSON.parse(war.penalties)
    entity.displayedDiff = war.displayedDiff
    entity.scoreHost = war.scoreHost
    entity.scoreOpponent = war.scoreOpponent
    return entity
  }

  public hasPlayer(playerId: string) {
    return this.warTracks.flatMap(track => track.warPositions).map(pos => pos?.playerId).includes(playerId)
  }

}

export class WarTrack {
  mid?: string;
  trackIndex?: number;
  warPositions?: WarPosition[];
  shocks?: WarShock[];
  teamScore?: number;
  opponentScore?: number;
  diffScore?: number;

  public static fromDatasnapshot(snapshot: DataSnapshot): WarTrack {
    let instance = new WarTrack();
    let track = snapshot.val();
    let positions: WarPosition[] = new Array();
    let shocks: WarShock[] = new Array();
    snapshot.child('warPositions').forEach((warPosition) => {
      let position = WarPosition.fromDatasnapshot(warPosition);
      positions.push(position);
    });
    snapshot.child('shocks').forEach((warShock) => {
      let shock = WarShock.fromDatasnapshot(warShock);
      shocks.push(shock);
    });
    instance.mid = track.mid;
    instance.trackIndex = track.trackIndex;
    instance.warPositions = positions;
    instance.shocks = shocks;
    instance.teamScore = positions
      .map((pos) => WarPosition.positionToPoints(pos))
      .reduce((sum, current) => sum + current);
    instance.opponentScore =
      instance.teamScore == 0 ? 0 : 82 - instance.teamScore;
    instance.diffScore =
      instance.opponentScore == 0
        ? 0
        : instance.teamScore - instance.opponentScore;
    return instance;
  }

  public static create(trackIndex: number): WarTrack {
    let instance = new WarTrack();
    let date = new Date();
    instance.mid = date.getTime().toString();
    instance.trackIndex = trackIndex;
    instance.teamScore = 0;
    instance.opponentScore = 0;
    instance.diffScore = 0;
    return instance;
  }

  public static addPositionsAndShocks(
    warTrack: WarTrack,
    positions: WarPosition[],
    shocks: WarShock[]
  ): WarTrack {
    warTrack.warPositions = positions;
    warTrack.shocks = shocks;
    warTrack.teamScore = positions
      .map((pos) => WarPosition.positionToPoints(pos))
      .reduce((sum, current) => sum + current);
    warTrack.opponentScore =
      warTrack.teamScore == 0 ? 0 : 82 - warTrack.teamScore;
    warTrack.diffScore =
      warTrack.opponentScore == 0
        ? 0
        : warTrack.teamScore - warTrack.opponentScore;
    return warTrack;
  }

  public static addShocks(warTrack: WarTrack, shocks: WarShock[]): WarTrack {
    warTrack.shocks = shocks;
    return warTrack;
  }

  constructor() {}
}

export class WarPosition {
  mid?: string;
  playerId?: string;
  position?: number;

  public static fromDatasnapshot(snapshot: DataSnapshot): WarPosition {
    let instance = new WarPosition();
    let position = snapshot.val();
    instance.mid = position.mid;
    instance.playerId = position.playerId;
    instance.position = position.position;
    return instance;
  }

  public static create(playerId: string, position: number) {
    let instance = new WarPosition();
    let date = new Date();
    instance.mid = date.getTime().toString();
    instance.playerId = playerId;
    instance.position = position;
    return instance;
  }

  public static positionToPoints(pos: WarPosition): number {
    switch (pos.position) {
      case 1:
        return 15;
      case 2:
        return 12;
      case 3:
        return 10;
      case 4:
        return 9;
      case 5:
        return 8;
      case 6:
        return 7;
      case 7:
        return 6;
      case 8:
        return 5;
      case 9:
        return 4;
      case 10:
        return 3;
      case 11:
        return 2;
      case 12:
        return 1;
      default:
        return 0;
    }
  }
}

export class WarShock {
  playerId?: string;
  count?: number;

  public static fromDatasnapshot(snapshot: DataSnapshot): WarShock {
    let instance = new WarShock();
    let shock = snapshot.val();
    instance.playerId = shock.playerId;
    instance.count = shock.count;
    return instance;
  }

  public static create(playerId: string, count: number): WarShock {
    let instance = new WarShock();
    instance.playerId = playerId;
    instance.count = count;
    return instance;
  }
}

export class WarPenalty {
  teamId?: string;
  amount?: number;

  public static fromDatasnapshot(snapshot: DataSnapshot): WarPenalty {
    let instance = new WarPenalty();
    let penalty = snapshot.val();
    instance.teamId = penalty.teamId;
    instance.amount = penalty.amount;
    return instance;
  }

  public static create(teamId: string, amount: number): WarPenalty {
    let instance = new WarPenalty();
    instance.teamId = teamId;
    instance.amount = amount;
    return instance;
  }
}
