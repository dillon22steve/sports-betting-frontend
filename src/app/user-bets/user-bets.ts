import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { CommonModule } from '@angular/common';
import { UserService } from '../user-service';

@Component({
  selector: 'app-user-bets',
  imports: [CommonModule],
  templateUrl: './user-bets.html',
  styleUrl: './user-bets.css',
})
export class UserBetsComponent implements OnInit, OnChanges {

  @Input() userBets: ExistingUserBet[] = [];
  @Input() currentUser: any;
  @Output() close = new EventEmitter<void>();
  @Output() userUpdate = new EventEmitter<any>();

  activeTab: 'open' | 'settled' = 'open';

  constructor(private http: HttpClient, private userService: UserService) {}

  ngOnInit() {
    this.updateActiveTab();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['userBets']) {
      this.updateActiveTab();
    }
  }

  private updateActiveTab() {
    if (!this.userBets.some(b => !b.completed)) {
      this.activeTab = 'settled';
    } else {
      this.activeTab = 'open';
    }
  }


  get filteredBets(): ExistingUserBet[] {
    const bets = this.activeTab === 'open'
      ? this.userBets.filter(b => !b.completed)
      : this.userBets.filter(b => b.completed);

    return [...bets].sort((a, b) => 
      new Date(b.commenceTime).getTime() - new Date(a.commenceTime).getTime()
    );
  }

  getUserBets(apiUrl: string): Observable<any> {
    console.log('Fetching user bets from API:', apiUrl);
    return this.http.get<any>(apiUrl);
  }

  calculatePotentialWin(bet: ExistingUserBet): number {
    if (!bet.amountBet) return 0;
    
    let result: number;
    if (bet.point > 0) {
      result = (bet.amountBet * bet.point) / 100;
    } else {
      result = (bet.amountBet * 100) / Math.abs(bet.point);
    }
    
    return Math.round(result * 100) / 100;
  }

  removeBet(index: number) {
    const bet = this.filteredBets[index];

    if (!bet || bet.completed) return;

    // Remove from main array (not filtered array!)
    this.userBets = this.userBets.filter(b => b !== bet);

    const apiUrl = `http://localhost:8080/bets/delete?betId=${bet.id}`;
    this.http.delete(apiUrl).subscribe({
      next: () => {
        console.log('Bet removed successfully');
        this.userService.refundBalance(bet.amountBet? Number(bet.amountBet) : 0);
      },
      error: (err) => console.error('Error removing bet:', err)
    });
  }

}


export interface ExistingUserBet {
  id: string;
  homeTeam: string;
  awayTeam: string;
  teamBetOn: string;
  commenceTime: string;
  spread: number | null;
  point: number;
  amountBet: number | null;
  amountWonOrLost: number | null;
  completed: boolean;
  isWon: boolean;
}
