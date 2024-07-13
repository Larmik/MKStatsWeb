import { TrackStats } from '../models/stats';
import { Player } from '../models/team';
import { War, WarPosition } from '../models/war';

export class ListUtils {
  public static groupByTeamOpponent(
    wars: War[]
  ): { teamOpponent: string; values: War[] }[] {
    var groups = new Set(wars.map((item) => item.teamOpponent));
    let result: { teamOpponent: string; values: War[] }[] = [];
    groups.forEach((g) =>
      result.push({
        teamOpponent: g,
        values: wars.filter((i) => i.teamOpponent == g),
      })
    );
    return result;
  }

  public static groupBytrackIndex(
    wars: TrackStats[]
  ): { trackIndex: number; values: TrackStats[] }[] {
    var groups = new Set(wars.map((item) => item.trackIndex));
    let result: { trackIndex: number; values: TrackStats[] }[] = [];
    groups.forEach((g) => {
      if (g) {
        result.push({
          trackIndex: g,
          values: wars.filter((i) => i.trackIndex == g),
        });
      }
    });
    return result;
  }

  public static groupPositionByPlayerId(positions: {position: WarPosition, mkcPlayer: Player | undefined}[]): {player: Player, values: {position: WarPosition, mkcPlayer: Player | undefined}[]}[] {
    var groups = new Set(positions.map((item) => item.mkcPlayer));
    let result: { player: Player, values: {position: WarPosition, mkcPlayer: Player | undefined}[] }[] = [];
    groups.forEach((g) => {
      if (g) {
        result.push({
          player: g,
          values: positions.filter((i) => i.mkcPlayer == g),
        });
      }
    });
    return result;
  }

  public static groupPositionByPlayer(positions: {first: Player, second: number}[]): {first: Player, second: number[]}[] {
    var groups = new Set(positions.map((item) => item.first));
    let result: {first: Player, second: number[]}[] = [];
    groups.forEach((g) => {
      if (g) {
        result.push({
          first: g,
          second: positions.filter((i) => i.first == g).map(pos => pos.second),
        });
      }
    });
    return result;
  }

}
