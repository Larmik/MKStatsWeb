import { NgFor, NgIf } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { War } from '../../models/war';
import { WarItemComponent } from '../war-item/war-item.component';
import { PlayerItemComponent } from '../player-item/player-item.component';
import { WarStatsComponent } from '../war-stats/war-stats.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TeamItemComponent } from '../team-item/team-item.component';
import { MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';


@Component({
  selector: 'app-last-results',
  standalone: true,
  imports: [
    NgFor,
    WarItemComponent,
    PlayerItemComponent,
    WarStatsComponent,
    NgIf,
    MatFormFieldModule,
    TeamItemComponent,
    MatDialogModule,
  ],
  templateUrl: './last-results.component.html',
  styleUrl: './last-results.component.scss',
})
export class LastResultsComponent implements OnInit {
  @Input() wars!: War[];
  router: Router = inject(Router);

  ngOnInit(): void {

  }

  onWarClicked(war: War) {
    this.router.navigate(['/war/' + war.mid]);
  }
}
