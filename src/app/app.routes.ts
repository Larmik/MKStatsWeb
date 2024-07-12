import { Routes } from '@angular/router';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { CurrentWarComponent } from './current-war/current-war.component';
import { WarDetailsComponent } from './war-details/war-details.component';
import { PlayerProfileComponent } from './player-profile/player-profile.component';

export const routes: Routes = [
    { path: 'signup', component: SignupComponent },
    { path: '', component: LoginComponent },
    { path: 'home', component: HomeComponent },
    { path: 'currentWar', component: CurrentWarComponent },
    { path: 'war/:id', component: WarDetailsComponent },
    { path: 'player/:id', component: PlayerProfileComponent }
];
