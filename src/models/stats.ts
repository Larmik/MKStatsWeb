
import { ListUtils } from "../utils/list.utils"
import { NumberUtils } from "../utils/number.utils"
import { Player } from "./team"
import { War, WarPosition, WarTrack } from "./war"

export class WarStats {
    wars!: War[]
    highestVicory!: War
    loudestDefeat!: War

    constructor(wars: War[]) {
        this.wars = wars
        this.highestVicory = wars.sort((a, b) => (a.scoreHost ?? 0) > (b.scoreHost ?? 0) ? -1 : 1).filter(value => value.displayedDiff?.includes('+'))[0]
        this.loudestDefeat = wars.sort((a, b) => (a.scoreHost ?? 0) > (b.scoreHost ?? 0) ? 1 : -1).filter(value => value.displayedDiff?.includes('-'))[0]
    }
}

export class TeamStats{
    team: any
    totalPlayed?: number

    constructor(team: any, totalPlayed: number) {
        this.team = team
        this.totalPlayed = totalPlayed
    }
}
export class TrackStats {
    map? : any
    trackIndex? : number
    teamScore? : number
    playerScore? : number
    totalPlayed? : number
    winRate? : number
    shockCount? :number

    public static initWithMap(
        map: any,
        teamScore: number,
        playerScore: number,
        totalPlayed: number
    ): TrackStats {
        let track = new TrackStats()
        track.map = map
        track.teamScore = teamScore
        track.playerScore = playerScore
        track.totalPlayed = totalPlayed
        return track
    }

    public static initWithIndex(
        trackIndex: number,
        teamScore: number,
        playerScore: number,
        shockCount:number
    ): TrackStats {
        let track = new TrackStats()
        track.trackIndex = trackIndex
        track.teamScore = teamScore
        track.playerScore = playerScore
        track.shockCount = shockCount
        return track
    }
}

export class WarScore {
    war! : War
    score! : number

    constructor(war: War, score: number) {
        this.war = war
        this.score = score
    }
}

export class Stats {
    warStats! : WarStats
    mostPlayedTeam? : TeamStats[]
    mostDefeatedTeam? : TeamStats[]
    lessDefeatedTeam? : TeamStats[]
    warScores! : WarScore[]
    maps! : TrackStats[]
    averageForMaps!: TrackStats[]

    hghestScore?: WarScore
    lowestScore? : WarScore
    bestMap?: TrackStats[]
    worstMap?: TrackStats[]
    bestPlayerMap?: TrackStats[]
    worstPlayerMap?: TrackStats[]
    mostPlayedMap?: TrackStats[]
    averagePoints?: number
    averagePointsLabel?: string
    averageMapPoints?: number
    averagePlayerPosition?: number
    averageMapPointsLabel?: string
    mapsWon?: string
    shockCount?: number
    highestPlayerScore?: ({first: number, second: War})
    lowestPlayerScore?: ({first: number, second: War})

    constructor(warStats: WarStats,
        mostPlayedTeam: TeamStats[],
        mostDefeatedTeam: TeamStats[] ,
        lessDefeatedTeam: TeamStats[],
        warScores: WarScore[],
        maps: TrackStats[],
        averageForMaps: TrackStats[]
    ) {
        this.warStats = warStats
        this.mostPlayedTeam = mostPlayedTeam
        this.mostDefeatedTeam = mostDefeatedTeam
        this.lessDefeatedTeam = lessDefeatedTeam
        this.warScores = warScores
        this.maps = maps
        this.averageForMaps = averageForMaps

        this.hghestScore = warScores.sort(value => value.score)[0]
        this.lowestScore = warScores.sort(value => 0 - value.score)[0]
        this.averagePoints = Math.round((warScores.map(value => value.score).reduce((sum, cur) => sum + cur)) / warScores.length)

        this.bestMap = averageForMaps.sort((a,b) => (a.teamScore ?? 0) > (b.teamScore ?? 0) ? -1 : 1).slice(0, 3)
        this.worstMap = averageForMaps.sort((a,b) => (a.teamScore ?? 0) > (b.teamScore ?? 0) ? 1 : -1).slice(0, 3)
        this.bestPlayerMap = averageForMaps.sort((a,b) => (a.playerScore ?? 0) > (b.playerScore ?? 0) ? -1 : 1).slice(0, 3)
        this.worstPlayerMap = averageForMaps.sort((a,b) => (a.playerScore ?? 0) > (b.playerScore ?? 0) ? 1 : -1).slice(0, 3)
        this.mostPlayedMap = averageForMaps.sort((a,b) => (a.totalPlayed ?? 0) > (b.totalPlayed ?? 0) ? -1 : 1).slice(0, 3)
        let averagePlayerPositionValue = Math.round((maps.map(value => value.playerScore).reduce((sum, cur) => (sum ?? 0) + (cur ?? 0)) ?? 0) / maps.length)

        this.averageMapPoints = maps.map(value => value.teamScore).reduce((sum, cur) => (sum ?? 0) + (cur ?? 0)) ?? 0 / maps.length
        this.averagePlayerPosition = NumberUtils.pointsToPosition(averagePlayerPositionValue)
        this.shockCount = NumberUtils.round(((maps.map(value => value.shockCount).reduce((sum, cur) => (sum ?? 0) + (cur ??0)) ?? 0) / warStats.wars.filter(war => +(war.mid.substring(0, 10)) > 1679506013).length), 2)
        this.mapsWon = maps.filter(value => (value.teamScore ?? 0) > 41).length.toString() + "/" + maps.length.toString()
        this.averagePointsLabel = this.averagePoints.toString()
        this.averageMapPointsLabel = this.averageMapPoints.toString()

    }

    public getPlayerScores(playerId: string, players: Player[]) {
        let finalList: ({first: number, second: War})[] = []
        this.warStats.wars.forEach(war => {
            let positions: ({first: Player, second: number})[] = []
            war.warTracks.forEach(warTrack => {
                if (warTrack.warPositions) {
                    let trackPositions: {position: WarPosition, mkcPlayer: Player | undefined}[] = []
                    warTrack.warPositions.forEach(position => {
                        trackPositions.push(
                            {
                                position : position,
                                mkcPlayer : players.find(player => player.player_id.toString() == position.playerId)
                            }
                        )
                    })
                    ListUtils.groupPositionByPlayerId(trackPositions).forEach(entry => {
                        positions.push(
                            {
                                first: entry.player,
                                second: entry.values.map(pos => NumberUtils.positionToPoints(pos.position.position ?? 0)).reduce((a, b) => a+b)
                            }
                        )
                    })
                }
            })
            ListUtils.groupPositionByPlayer(positions)
            .map(pos => ({first: pos.first, second: pos.second.reduce((a,b) => a+b)}))
            .filter(value => value.first.player_id.toString() == playerId)
            .map(value => ({ first: value.second, second: war}))
            .forEach(item => {
                finalList.push(item)
            })
        })
        console.log
        this.highestPlayerScore = finalList.sort((a, b) => a.first > b.first ? -1 : 1)[0]
        this.lowestPlayerScore = finalList.sort((a, b) => a.first < b.first ? -1 : 1)[0]
    }
   
} 

