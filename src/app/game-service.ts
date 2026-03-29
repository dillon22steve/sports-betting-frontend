import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Game } from './game-model';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private baseUrl = 'http://localhost:8080/odds?sport='

  constructor(private http: HttpClient) {}

  getGames(league : string): Observable<Game[]> {
    const sportEndpoint = this.determineSportEndpoint(league);
    return this.http.get<Game[]>(`${this.baseUrl}${sportEndpoint}`);
  }

  determineSportEndpoint(league: string): string {
    switch (league) {
      case 'NBA':
        return 'basketball_nba';
      case 'NCAAB':
        return 'basketball_ncaab';
      case 'NHL':
        return 'icehockey_nhl';
      case 'MLB':
        return 'baseball_mlb';
      case 'NFL':
        return 'americanfootball_nfl';
      case 'NCAAF':
        return 'americanfootball_ncaaf';
      default:
        throw new Error(`Unsupported league: ${league}`);
    }

  }
}