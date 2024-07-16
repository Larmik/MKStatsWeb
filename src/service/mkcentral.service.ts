import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MKCentralService {
  private registryUrl = 'https://www.mariokartcentral.com/mkc/api/registry';

  private http: HttpClient = inject(HttpClient);

  getTeamById(id: string): Observable<any> {
    return this.http.get(`${this.registryUrl}/teams/${id}`);
  }
  getTeams(mode: string): Observable<any> {
    return this.http.get(`${this.registryUrl}/teams/category/${mode}`);
  }

  getPlayerById(id: string): Observable<any> {
    return this.http.get(`${this.registryUrl}/players/${id}`);
  }

  searchTeam(query: string): Observable<any> {
    return this.http.get(
      `${this.registryUrl}/teams/category/active?search=${query}`
    );
  }
}
