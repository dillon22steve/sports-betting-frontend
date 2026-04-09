import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ExistingUserBet } from './user-bets/user-bets';

@Injectable({
  providedIn: 'root' // This makes it available throughout the app
})
export class UserBetService {
  private readonly apiUrl = 'http://localhost:8080/bets';

  constructor(private http: HttpClient) {}

  // Centralized method to fetch bets
  getBets(userId: string): Observable<ExistingUserBet[]> {
    console.log('Fetching bets for user ID:', userId);
    return this.http.get<ExistingUserBet[]>(`${this.apiUrl}?userId=${userId}`);
  }
}