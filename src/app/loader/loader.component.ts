import { Component, Inject, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { LocalService } from '../../service/local.service';
import { MKCentralService } from '../../service/mkcentral.service';
import { MatButtonModule } from '@angular/material/button';
import { FirebaseService } from '../../service/firebase.service';
import { User } from '../../models/user';
import { Player, Roster, Team } from '../../models/team';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-link-mkc',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, NgIf, MatProgressSpinnerModule],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.scss',
})
export class LoaderComponent {
  local: LocalService = inject(LocalService);
  service: MKCentralService = inject(MKCentralService);
  firebase: FirebaseService = inject(FirebaseService);
  message?: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: string) {
    this.message = data
  }

  


}

