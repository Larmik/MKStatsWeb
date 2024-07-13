import { Component, Input, OnInit } from '@angular/core';
import { Player } from '../../models/team';
import { NgFor, NgIf } from '@angular/common';
import { War, WarPosition, WarTrack } from '../../models/war';
import { NumberUtils } from '../../utils/number.utils';

export class PlayerScore {
  name!: string;
  tracksPlayed?: number;
  country?: string
  score!: number;
  shockCount!: number
}

@Component({
  selector: 'app-players-scores',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './players-scores.component.html',
  styleUrl: './players-scores.component.scss',
})
export class PlayersScoresComponent implements OnInit {
  @Input() players!: Player[];
  @Input() war!: War;
  scores!: PlayerScore[];

  ngOnInit(): void {
    let scoreMap: PlayerScore[] = [];
    this.players.forEach((player: Player) => {
      let tracksPlayed = this.war.warTracks.filter((track) =>
        track.warPositions
          ?.map((pos) => pos.playerId)
          .includes(player.player_id.toString())
      ).length;
      this.war.warTracks.forEach((track: WarTrack) => {
        let positionForPlayer = track.warPositions?.find(
          (position: WarPosition) =>
            position.playerId == player.player_id.toString()
        );
        let scoreForPlayer =
          scoreMap.find(
            (score: PlayerScore) => score.name == player.display_name
          )?.score ?? 0;
        if (positionForPlayer) {
          let score = new PlayerScore();
          let points = NumberUtils.positionToPoints(positionForPlayer.position ?? 0);
          var shockCount = 0
          this.war.warTracks.forEach(track => {
            track.shocks?.forEach(shock => {
              if (shock.playerId == player.player_id.toString()) {
                shockCount += shock.count ?? 0
              }
            })
          })
          score.name = player.display_name;
          score.score = scoreForPlayer + points;
          score.shockCount = shockCount
          if (tracksPlayed < this.war.warTracks.length)
            score.tracksPlayed = tracksPlayed;
          if (
            scoreMap.map((score) => score.name).includes(player.display_name)
          ) {
            let itemIndex = scoreMap.findIndex(
              (item) => item.name == player.display_name
            );
            scoreMap[itemIndex] = score;
          } else scoreMap.push(score);
        }
      });
    });
    if (scoreMap.length == 0) {
      this.players.forEach((player) => {
        let score = new PlayerScore();
        score.name = player.display_name;
        score.score = 0;
        scoreMap.push(score);
      });
    }
    this.scores = scoreMap.sort((a, b) => (a.score > b.score ? -1 : 1));
  }
}
