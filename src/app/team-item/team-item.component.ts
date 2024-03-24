import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-team-item',
  standalone: true,
  imports: [],
  templateUrl: './team-item.component.html',
  styleUrl: './team-item.component.scss',
})
export class TeamItemComponent {
  @Input() team!: any;

  toTeamColor(teamColor: number): string {
    let colorString;
    switch (teamColor) {
      case 1:
        colorString = '#ef5350';
        break;
      case 2:
        colorString = '#ffa726';
        break;
      case 3:
        colorString = '#d4e157';
        break;
      case 4:
        colorString = '#66bb6a';
        break;
      case 5:
        colorString = '#26a69a';
        break;
      case 6:
        colorString = '#29b6f6';
        break;
      case 7:
        colorString = '#5c6bc0';
        break;
      case 8:
        colorString = '#7e57c2';
        break;
      case 9:
        colorString = '#ec407a';
        break;
      case 10:
        colorString = '#888888';
        break;
      case 11:
        colorString = '#c62828';
        break;
      case 12:
        colorString = '#ef6c00';
        break;
      case 13:
        colorString = '#9e9d24';
        break;
      case 14:
        colorString = '#2e7d32';
        break;
      case 15:
        colorString = '#00897b';
        break;
      case 16:
        colorString = '#0277bd';
        break;
      case 17:
        colorString = '#283593';
        break;
      case 18:
        colorString = '#4527a0';
        break;
      case 19:
        colorString = '#ad1457';
        break;
      case 20:
        colorString = '#444444';
        break;
      case 21:
        colorString = '#d44a48';
        break;
      case 22:
        colorString = '#e69422';
        break;
      case 23:
        colorString = '#bdc74e';
        break;
      case 24:
        colorString = '#4a874c';
        break;
      case 25:
        colorString = '#208c81';
        break;
      case 26:
        colorString = '#25a5db';
        break;
      case 27:
        colorString = '#505ca6';
        break;
      case 28:
        colorString = '#6c4ca8';
        break;
      case 29:
        colorString = '#d13b6f';
        break;
      case 30:
        colorString = '#545454';
        break;
      case 31:
        colorString = '#ab2424';
        break;
      case 32:
        colorString = '#d45f00';
        break;
      case 33:
        colorString = '#82801e';
        break;
      case 34:
        colorString = '#205723';
        break;
      case 35:
        colorString = '#006e61';
        break;
      case 36:
        colorString = '#0369a3';
        break;
      case 37:
        colorString = '#222d78';
        break;
      case 38:
        colorString = '#382185';
        break;
      case 39:
        colorString = '#91114b';
        break;
      default:
        colorString = '#000000';
    }
    return colorString;
  }
}
