import {
  Component,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { War } from '../../models/war';
import { LocalService } from '../../service/local.service';
import { HeaderComponent } from '../header/header.component';
import { FirebaseService } from '../../service/firebase.service';
import { Player } from '../../models/team';
import { NgIf } from '@angular/common';
import { DatabaseService } from '../../service/database.service';
import { WarStatsComponent } from '../war-stats/war-stats.component';
import { Stats, TeamStats, TrackStats, WarScore, WarStats } from '../../models/stats';
import { MKCentralService } from '../../service/mkcentral.service';
import { Maps } from '../../models/maps';
import { ListUtils } from '../../utils/list.utils';
import { NumberUtils } from '../../utils/number.utils';
import { StatsAveragesItemComponent } from '../stats-averages-item/stats-averages-item.component';
import { StatsRecordsItemComponent } from '../stats-records-item/stats-records-item.component';
import { StatsOpponentsItemComponent } from '../stats-opponents-item/stats-opponents-item.component';
import { StatsMapsItemComponent } from '../stats-maps-item/stats-maps-item.component';
import { StatsComponent } from "../stats/stats.component";

@Component({
  selector: 'app-player-profile',
  standalone: true,
  imports: [HeaderComponent, WarStatsComponent, NgIf, StatsAveragesItemComponent, StatsRecordsItemComponent, StatsOpponentsItemComponent, StatsMapsItemComponent, StatsComponent],
  templateUrl: './player-profile.component.html',
  styleUrl: './player-profile.component.scss',
})
export class PlayerProfileComponent implements OnInit {
  @Output() id: string | null = '';
  player?: Player;
  wars!: War[];
  stats!: Stats

  victoryLabel!: string
  defeatLabel!: string

  local: LocalService = inject(LocalService);
  database: DatabaseService = inject(DatabaseService);
  firebase: FirebaseService = inject(FirebaseService);
  mkcentral: MKCentralService = inject(MKCentralService)

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.id = params.get('id');
      let player = this.local
        .getPlayers()
        .flatMap((value) => value.players)
        .find((player) => player.player_id.toString() == this.id);
      this.player = player;
    });
    this.database.getWars().subscribe((wars) => {
      this.wars = wars.map((war) => War.fromEntity(war)).filter(war => war.hasPlayer(this.id ?? ''));
      this.getStats()
    });
  }

  getStats() {
    var mostPlayedTeamData: TeamStats | undefined = undefined
    var mostDefeatedTeamData: TeamStats | undefined = undefined
    var lessDefeatedTeamData: TeamStats | undefined = undefined
    let maps: TrackStats[] = []
    let warScores: WarScore[] = []
    let averageForMaps: TrackStats[] = []
    
    let mostPlayedTeamId = ListUtils.groupByTeamOpponent(this.wars)
      .sort((a, b) => a.values.length > b.values.length ? -1 : 1)[0]
    let mostDefeatedTeamId = ListUtils.groupByTeamOpponent(this.wars.filter(war => war.displayedDiff?.includes('+')))
      .sort((a, b) => a.values.length > b.values.length ? -1 : 1)[0]
    let lessDefeatedTeamId = ListUtils.groupByTeamOpponent(this.wars.filter(war => war.displayedDiff?.includes('-')))
      .sort((a, b) => a.values.length > b.values.length ? -1 : 1)[0]

    this.wars.map(war => ({key: war, value: war.warTracks}))
      .forEach(map => {
          var currentPoints = 0
          map.value.forEach(track => {
              let playerScoreForTrack = NumberUtils.positionToPoints(track.warPositions?.find(pos => pos.playerId == this.id)?.position ?? 0)
              var teamScoreForTrack = 0
              track.warPositions?.map(pos => NumberUtils.positionToPoints(pos.position ?? 0))?.forEach(points => {teamScoreForTrack += (points ?? 0)})
              if (this.id == '') 
                currentPoints += teamScoreForTrack
              else 
                currentPoints += playerScoreForTrack ?? 0
              var shockCount = 0
              track.shocks?.filter(shock => this.id == '' || shock.playerId == this.id)?.map(shock => shock.count)?.forEach(count => shockCount += count ?? 0)
              maps.push(
                TrackStats.initWithIndex(
                    track.trackIndex ?? 0,
                    teamScoreForTrack,
                    playerScoreForTrack ?? 0,
                    shockCount
                )
              )
          })
          warScores.push(new WarScore(map.key, currentPoints))
          currentPoints = 0 
      })

    ListUtils.groupBytrackIndex(maps)
    .filter(groupList => groupList.values.length > 0)
    .forEach(entry => {
        let stats = TrackStats.initWithMap(
            [...Maps.values()][entry.trackIndex],
            (entry.values.map((value: TrackStats) => value.teamScore ?? 0).reduce((sum: any, current: any) => sum + current) / entry.values.map((value: TrackStats) => value.teamScore).length),
            (entry.values.map((value: TrackStats) => value.playerScore ?? 0).reduce((sum: any, current: any) => sum + current) / entry.values.map((value: TrackStats) => value.playerScore).length),
            entry.values.length

        )
        averageForMaps.push(stats)
    })

    //A optimiser (créer une table Dexie pour les teams et remplacer les appels à MKC)
    this.mkcentral.getTeamById(mostPlayedTeamId.teamOpponent)
    .subscribe(team => {
      mostPlayedTeamData = new TeamStats(team, mostPlayedTeamId.values.length)
      this.mkcentral.getTeamById(mostDefeatedTeamId.teamOpponent)
      .subscribe(team => {
        mostDefeatedTeamData = new TeamStats(team, mostDefeatedTeamId.values.length)
        this.mkcentral.getTeamById(lessDefeatedTeamId.teamOpponent)
        .subscribe(team => {
          lessDefeatedTeamData = new TeamStats(team, lessDefeatedTeamId.values.length)
          let stats = new Stats(
            new WarStats(this.wars),
            mostPlayedTeamData,
            mostDefeatedTeamData,
            lessDefeatedTeamData,
            warScores,
            maps,
            averageForMaps,
          )
          this.mkcentral.getTeamById(stats.warStats.highestVicory.teamOpponent).subscribe(victoryOp => {
            this.mkcentral.getTeamById(stats.warStats.loudestDefeat.teamOpponent).subscribe(defeatOp => {
              let team = this.local.getTeam()?.team_name
              stats.getPlayerScores(this.id ?? '', this.local.getPlayers().flatMap(roster => roster.players))
              this.victoryLabel = team + " - " + victoryOp.team_name
              this.defeatLabel = team + " - " + defeatOp.team_name
              this.stats = stats      
            })
          })  
        })
      })
    })
  }
}
