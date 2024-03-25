import { Component, Inject, OnInit, inject } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { NgClass } from '@angular/common';
import { LocalService } from '../../service/local.service';
import { Player } from '../../models/team';
import { PlayerScore } from '../players-scores/players-scores.component';
import { WarPosition, WarTrack } from '../../models/war';
import { MKCentralService } from '../../service/mkcentral.service';

@Component({
  selector: 'app-edit-tab',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, NgClass],
  templateUrl: './edit-tab.component.html',
  styleUrl: './edit-tab.component.scss',
})
export class EditTabComponent implements OnInit {
  local: LocalService = inject(LocalService);
  service: MKCentralService = inject(MKCentralService)
  output!: string;
  players!: Player[];

  constructor(@Inject(MAT_DIALOG_DATA) public data: Player[]) {
    this.players = data;
  }

  ngOnInit(): void {}

  private setCodeTabForOpponents(): string {
    let value = ""
    let opponent1Name = (<HTMLInputElement>document.getElementById("opponent1Name")).value
    let opponent1Flag = (<HTMLInputElement>document.getElementById("opponent1Flag")).value
    let opponent1Score = (<HTMLInputElement>document.getElementById("opponent1Score")).value

    let opponent2Name = (<HTMLInputElement>document.getElementById("opponent2Name")).value
    let opponent2Flag = (<HTMLInputElement>document.getElementById("opponent2Flag")).value
    let opponent2Score = (<HTMLInputElement>document.getElementById("opponent2Score")).value

    let opponent3Name = (<HTMLInputElement>document.getElementById("opponent3Name")).value
    let opponent3Flag = (<HTMLInputElement>document.getElementById("opponent3Flag")).value
    let opponent3Score = (<HTMLInputElement>document.getElementById("opponent3Score")).value

    let opponent4Name = (<HTMLInputElement>document.getElementById("opponent4Name")).value
    let opponent4Flag = (<HTMLInputElement>document.getElementById("opponent4Flag")).value
    let opponent4Score = (<HTMLInputElement>document.getElementById("opponent4Score")).value

    let opponent5Name = (<HTMLInputElement>document.getElementById("opponent5Name")).value
    let opponent5Flag = (<HTMLInputElement>document.getElementById("opponent5Flag")).value
    let opponent5Score = (<HTMLInputElement>document.getElementById("opponent5Score")).value

    let opponent6Name = (<HTMLInputElement>document.getElementById("opponent6Name")).value
    let opponent6Flag = (<HTMLInputElement>document.getElementById("opponent6Flag")).value
    let opponent6Score = (<HTMLInputElement>document.getElementById("opponent6Score")).value


    let opponent7Name = (<HTMLInputElement>document.getElementById("opponent7Name")).value
    let opponent7Flag = (<HTMLInputElement>document.getElementById("opponent7Flag")).value
    let opponent7Score = (<HTMLInputElement>document.getElementById("opponent7Score")).value

    let opponent8Name = (<HTMLInputElement>document.getElementById("opponent8Name")).value
    let opponent8Flag = (<HTMLInputElement>document.getElementById("opponent8Flag")).value
    let opponent8Score = (<HTMLInputElement>document.getElementById("opponent8Score")).value

    value += opponent1Name + " [" + opponent1Flag + "] " + opponent1Score + "<br/>"
    value += opponent2Name + " [" + opponent2Flag + "] " + opponent2Score + "<br/>"
    value += opponent3Name + " [" + opponent3Flag + "] " + opponent3Score + "<br/>"
    value += opponent4Name + " [" + opponent4Flag + "] " + opponent4Score + "<br/>"
    value += opponent5Name + " [" + opponent5Flag + "] " + opponent5Score + "<br/>"
    value += opponent6Name + " [" + opponent6Flag + "] " + opponent6Score + "<br/>"

    if (opponent7Name && opponent7Score)
      value += opponent7Name + " [" + opponent7Flag + "] " + opponent7Score + "<br/>"

    if (opponent8Name && opponent8Score)
      value += opponent8Name + " [" + opponent8Flag + "] " + opponent8Score + "<br/>"



    return value

  }

  generateTab() {
    let war = this.local.getCurrentWar();

    let team = this.local.getTeam();
    let codeString = '';
    let scoreMap: PlayerScore[] = [];


    this.players.forEach((player: Player) => {
      let tracksPlayed = war?.warTracks.filter((track) =>
        track.warPositions
          ?.map((pos) => pos.playerId)
          .includes(player.player_id.toString())
      ).length;
      war?.warTracks.forEach((track: WarTrack) => {
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
          let points = WarPosition.positionToPoints(positionForPlayer);
          score.name = player.display_name;
          score.score = scoreForPlayer + points;
          score.country = player.country_code.toLowerCase()
          if (war && tracksPlayed && tracksPlayed < war?.warTracks.length)
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
    this.service.getTeamById(war?.teamOpponent ?? "")
    .subscribe((opponent: any) => {
      codeString += team?.team_tag + ' - ' + team?.team_name + ' #B0E0E6 <br/>';
      scoreMap.forEach((score) => {
        if (score.tracksPlayed)
          codeString +=
            score.name +
            ' (' +
            score.tracksPlayed +
            ') [' +
            score.country +
            '] ' +
            score.score +
            '<br/>';
        else
          codeString +=
            score.name + ' [' + score.country + '] ' + score.score + ' <br/>';
      });
      codeString += "<br/>" + opponent.team_tag + ' - ' + opponent.team_name + ' #FFFFFF <br/>';
      codeString += this.setCodeTabForOpponents()
      this.output = codeString

    })

    
  }

}
